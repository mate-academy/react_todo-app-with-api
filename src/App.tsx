/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  clearCompletedTodos,
  deleteTodo,
  getTodos,
  postTodo,
  toggleAllTodos,
  toggleTodo,
  updateTodoTitle,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilterType';
import { ErrorType } from './types/ErrorType';
import { TodoHeader } from './components/TodoHeader/TodoHeader';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [errorMessage, setErrorMessage] = useState<ErrorType | ''>('');
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('LOAD_TODOS'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('EMPTY_TITLE');

      return;
    }

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);
    setIsSubmitting(true);

    postTodo(trimmedTitle)
      .then((createdTodo: Todo) => {
        setTodos(prev => [...prev, createdTodo]);
        setNewTodoTitle('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage('ADD_TODO');
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (deletingTodoIds.length === 0 && !isSubmitting) {
      inputRef.current?.focus();
    }
  }, [deletingTodoIds, isSubmitting]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = (() => {
    switch (filter) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  })();

  const activeTodos = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompleted = completedTodos.length > 0;

  const handleDelete = (id: number) => {
    setDeletingTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage('DELETE_TODO');
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setDeletingTodoIds(prev => [...prev, ...completedIds]);

    clearCompletedTodos(completedIds).then(results => {
      const successfulIds: number[] = [];
      const failedIds: number[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfulIds.push(completedIds[index]);
        } else {
          failedIds.push(completedIds[index]);
        }
      });

      setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

      if (failedIds.length > 0) {
        setErrorMessage('DELETE_TODO');
      }

      setDeletingTodoIds(prev => prev.filter(id => !completedIds.includes(id)));
    });
  };

  const handleToggleTodo = (todo: Todo) => {
    const newStatus = !todo.completed;

    setUpdatingTodoIds(prev => [...prev, todo.id]);

    toggleTodo(todo.id, newStatus)
      .then(() => {
        setTodos(prev =>
          prev.map(t =>
            t.id === todo.id ? { ...t, completed: newStatus } : t,
          ),
        );
      })
      .catch(() => setErrorMessage('UPDATE_TODO'))
      .finally(() =>
        setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id)),
      );
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const targetStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    setUpdatingTodoIds(prev => [
      ...prev,
      ...todosToUpdate.map(todo => todo.id),
    ]);

    toggleAllTodos(todosToUpdate, targetStatus).then(results => {
      const successfulIds = results
        .filter(r => r.status === 'fulfilled')
        .map((_, i) => todosToUpdate[i].id);

      const failedIds = results
        .filter(r => r.status === 'rejected')
        .map((_, i) => todosToUpdate[i].id);

      setTodos(prev =>
        prev.map(todo =>
          successfulIds.includes(todo.id)
            ? { ...todo, completed: targetStatus }
            : todo,
        ),
      );

      if (failedIds.length > 0) {
        setErrorMessage('UPDATE_TODO');
      }

      setUpdatingTodoIds(prev =>
        prev.filter(id => !todosToUpdate.map(t => t.id).includes(id)),
      );
    });
  };

  const handleEditTodo = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const handleSaveEdit = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      setUpdatingTodoIds(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
          setEditingTodoId(null);
          setEditingTitle('');
        })
        .catch(() => {
          setErrorMessage('DELETE_TODO');
        })
        .finally(() => {
          setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
        });

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);
      setEditingTitle('');

      return;
    }

    setUpdatingTodoIds(prev => [...prev, todo.id]);

    updateTodoTitle(todo.id, trimmedTitle)
      .then(() => {
        setTodos(prev =>
          prev.map(t => (t.id === todo.id ? { ...t, title: trimmedTitle } : t)),
        );
        setEditingTodoId(null);
        setEditingTitle('');
      })
      .catch(() => {
        setErrorMessage('UPDATE_TODO');
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const handleKeyUpEdit = (
    e: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (e.key === 'Enter') {
      handleSaveEdit(todo);
    }

    if (e.key === 'Escape') {
      setEditingTodoId(null);
      setEditingTitle('');
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          todosCount={todos.length}
          allCompleted={todos.every(todo => todo.completed)}
          isSubmitting={isSubmitting}
          newTodoTitle={newTodoTitle}
          inputRef={inputRef}
          onSubmit={submit}
          onChangeTitle={setNewTodoTitle}
          onToggleAll={handleToggleAll}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          deletingTodoIds={deletingTodoIds}
          updatingTodoIds={updatingTodoIds}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          isSubmitting={isSubmitting}
          onToggle={handleToggleTodo}
          onDelete={handleDelete}
          onEdit={handleEditTodo}
          onChangeTitle={setEditingTitle}
          onSaveEdit={handleSaveEdit}
          onKeyUpEdit={handleKeyUpEdit}
        />

        {todos.length > 0 && (
          <TodoFooter
            activeTodos={activeTodos}
            filter={filter}
            hasCompleted={hasCompleted}
            onChangeFilter={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
