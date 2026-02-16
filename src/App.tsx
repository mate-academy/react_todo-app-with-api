import React, { useEffect, useRef, useState } from 'react';
import { USER_ID } from './api/todos';
import * as doTodo from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { ErrorMessage } from './types/ErrorMessage';

import { Header, TodoList, Footer, ErrorNotification } from './components';
import { UserWarning } from './UserWarning';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      const data = await doTodo.getTodos();

      setTodos(data);
    } catch {
      setError(ErrorMessage.LoadTodos);
    }
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;
      case Filter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  const allCompleted = todos.length > 0 && todos.every(t => t.completed);
  const hasCompleted = todos.some(t => t.completed);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = title.trim();

    if (!trimmed) {
      setError(ErrorMessage.EmptyTitle);

      return;
    }

    try {
      setIsAdding(true);

      const temp: Todo = {
        id: 0,
        title: trimmed,
        completed: false,
        userId: USER_ID,
      };

      setTempTodo(temp);

      const newTodo = await doTodo.addTodo(trimmed);

      setTodos(prev => [...prev, newTodo]);
      setTitle('');
      setTempTodo(null);
    } catch {
      setError(ErrorMessage.AddTodo);
      setTempTodo(null);
    } finally {
      setIsAdding(false);

      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  };

  const handleDelete = (id: number) => {
    setProcessingIds(prev => [...prev, id]);

    doTodo
      .deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));

        setTimeout(() => {
          inputRef.current?.focus();
        });
      })
      .catch(() => setError(ErrorMessage.DeleteTodo))
      .finally(() => {
        setProcessingIds(prev => prev.filter(pid => pid !== id));
      });
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.completed);

    const deletePromises = completed.map(todo => {
      setProcessingIds(prev => [...prev, todo.id]);

      return doTodo
        .deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError(ErrorMessage.DeleteTodo);
        })
        .finally(() => {
          setProcessingIds(prev => prev.filter(id => id !== todo.id));
        });
    });

    Promise.allSettled(deletePromises).then(() => {
      setTimeout(() => inputRef.current?.focus());
    });
  };

  const handleToggle = (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);

    doTodo
      .updateTodo(todo.id, { completed: !todo.completed })
      .then(updated =>
        setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t))),
      )
      .catch(() => setError(ErrorMessage.UpdateTodo))
      .finally(() =>
        setProcessingIds(prev => prev.filter(id => id !== todo.id)),
      );
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => {
      setProcessingIds(prev => [...prev, todo.id]);

      doTodo
        .updateTodo(todo.id, { completed: newCompletedStatus })
        .then(updatedTodo => {
          setTodos(prev => prev.map(t => (t.id === todo.id ? updatedTodo : t)));
        })
        .catch(() => setError(ErrorMessage.UpdateTodo))
        .finally(() => {
          setProcessingIds(prev => prev.filter(id => id !== todo.id));
        });
    });
  };

  const handleRename = (todo: Todo) => {
    const trimmed = editTitle.trim();

    if (!trimmed) {
      handleDelete(todo.id);

      return;
    }

    setProcessingIds(prev => [...prev, todo.id]);

    doTodo
      .updateTodo(todo.id, { title: trimmed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
        setEditingId(null);
      })
      .catch(() => setError(ErrorMessage.UpdateTodo))
      .finally(() =>
        setProcessingIds(prev => prev.filter(id => id !== todo.id)),
      );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          setTitle={setTitle}
          onSubmit={handleSubmit}
          inputRef={inputRef}
          isAdding={isAdding}
          hasTodos={todos.length > 0}
          allCompleted={allCompleted}
          onToggleAll={handleToggleAll}
        />

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            editingId={editingId}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            setEditingId={setEditingId}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onRename={handleRename}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todosLeft={todos.filter(t => !t.completed).length}
            hasCompleted={hasCompleted}
            currentFilter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification error={error} clearError={() => setError('')} />
    </div>
  );
};
