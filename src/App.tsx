/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  deleteTodo,
  getTodos,
  addTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { TodoItem } from './components/TodoItem';

export const App: React.FC = () => {
  // #region state
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<FilterStatus>('All');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState<string>('');
  const [isDisabled, setIsDisabled] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');
  const focusRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region effect
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setTempTodo(null);

    getTodos()
      .then(setTodos)
      .catch(() => setError(ErrorMessage.LoadTodos))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      focusRef.current?.focus();
    }
  }, [loading]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => setError(''), 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!isDisabled) {
      focusRef.current?.focus();
    }
  }, [isDisabled]);

  useEffect(() => {
    if (selectedIds.length === 0) {
      focusRef.current?.focus();
    }
  }, [selectedIds]);
  // #endregion

  // #region func
  const filteredTodos = (() => {
    switch (filter) {
      case 'Active':
        return todos.filter(t => !t.completed);
      case 'Completed':
        return todos.filter(t => t.completed);
      case 'All':
      default:
        return todos;
    }
  })();

  const activeCount = todos.filter(todo => !todo.completed).length;
  const completedCount = todos.filter(todo => todo.completed).length;

  function handleAdd(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const input = focusRef.current;

    if (!title.trim()) {
      setError(ErrorMessage.EmptyTitle);
      setTimeout(() => setError(''), 3000);

      return;
    }

    setIsDisabled(true);
    input?.blur();

    const newTemp: Todo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTemp);

    addTodo(newTemp)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        setError(ErrorMessage.AddTodo);
        setTimeout(() => setError(''), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setIsDisabled(false);
      });
  }

  function handleDelete(todoId: number) {
    setSelectedIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setError(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setSelectedIds(prev => prev.filter(id => id !== todoId));
      });
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    completedTodos.forEach(todo => {
      handleDelete(todo.id);
    });
  }

  function handleToggle(updatedTodo: Todo) {
    setSelectedIds(prev => [...prev, updatedTodo.id]);

    const toggledTodo = { ...updatedTodo, completed: !updatedTodo.completed };

    updateTodo(toggledTodo)
      .then(() => {
        setTodos(prev =>
          prev.map(t => (t.id === toggledTodo.id ? toggledTodo : t)),
        );
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setSelectedIds(prev => prev.filter(id => id !== updatedTodo.id));
      });
  }

  function handleToggleAll() {
    const shouldComplete = todos.some(t => !t.completed);
    const todosToUpdate = todos.filter(t => t.completed !== shouldComplete);

    setSelectedIds(todosToUpdate.map(t => t.id));
    todosToUpdate.forEach(todo => {
      const updatedTodo = { ...todo, completed: shouldComplete };

      updateTodo(updatedTodo)
        .then(() => {
          setTodos(prev =>
            prev.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
          );
        })
        .catch(() => {
          setError(ErrorMessage.UpdateTodo);
        })
        .finally(() => {
          setSelectedIds(prev => prev.filter(id => id !== todo.id));
        });
    });
  }

  function handleEditing(todoId: number) {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    setEditingId(todoId);
    setEditingTitle(todo.title);
  }

  function handleSave(todoId: number, newTitle: string) {
    const todo = todos.find(t => t.id === todoId);
    const trimmed = newTitle.trim();

    if (!todo) {
      return;
    }

    if (!trimmed) {
      setSelectedIds(prev => [...prev, todoId]);

      deleteTodo(todoId)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todoId));
          setEditingId(null);
        })
        .catch(() => {
          setError(ErrorMessage.DeleteTodo);
        })
        .finally(() => {
          setSelectedIds(prev => prev.filter(id => id !== todoId));
        });

      return;
    }

    if (trimmed === todo.title) {
      setEditingId(null);

      return;
    }

    const updatedTodo = { ...todo, title: trimmed };

    setSelectedIds(prev => [...prev, todoId]);

    updateTodo(updatedTodo)
      .then(() => {
        setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
        setEditingId(null);
      })
      .catch(() => {
        setError(ErrorMessage.UpdateTodo);
      })
      .finally(() => {
        setSelectedIds(prev => prev.filter(id => id !== todoId));
      });
  }

  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {loading ? (
          <p>Loading</p>
        ) : (
          <>
            <TodoForm
              focusRef={focusRef}
              handleAdd={handleAdd}
              handleToggleAll={handleToggleAll}
              isDisabled={isDisabled}
              title={title}
              setTitle={setTitle}
              todos={todos}
            />
            <TodoList
              todos={filteredTodos}
              onDelete={handleDelete}
              selectedIds={selectedIds}
              onToggle={handleToggle}
              handleEditing={handleEditing}
              handleSave={handleSave}
              editingId={editingId}
              editingTitle={editingTitle}
              setEditingId={setEditingId}
              setEditingTitle={setEditingTitle}
            />
            {tempTodo && (
              <TodoItem
                key={tempTodo.id}
                todo={tempTodo}
                onDelete={handleDelete}
                selectedIds={selectedIds}
                onToggle={handleToggle}
                handleEditing={handleEditing}
                handleSave={handleSave}
                editingId={editingId}
                editingTitle={editingTitle}
                setEditingId={setEditingId}
                setEditingTitle={setEditingTitle}
                isTemp={true}
              />
            )}
            <Footer
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              completedCount={completedCount}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification message={error} onClear={() => setError('')} />
    </div>
  );
};
