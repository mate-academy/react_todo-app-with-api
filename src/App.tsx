/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorMessage } from './types/ErrorMessage';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const closeError = () => setErrorMessage('');

  const showError = (message: ErrorMessage) => {
    setErrorMessage(message);
  };

  // LOAD
  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  // FILTER
  const visibleTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterStatus.Active:
          return !todo.completed;
        case FilterStatus.Completed:
          return todo.completed;
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  // ADD
  const handleCreateTodo = (title: string): Promise<void> => {
    setErrorMessage('');

    const trimmed = title.trim();

    if (!trimmed) {
      showError('Title should not be empty');
      inputRef.current?.focus();

      return Promise.reject();
    }

    const optimistic: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(optimistic);

    return addTodo(trimmed)
      .then(created => {
        setTodos(prev => [...prev, created]);
      })
      .catch(() => {
        showError('Unable to add a todo');

        return Promise.reject();
      })
      .finally(() => {
        setTempTodo(null);
        inputRef.current?.focus();
      });
  };

  // DELETE 1
  const handleDeleteTodo = (id: number) => {
    setErrorMessage('');
    setProcessingIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setProcessingIds(prev => prev.filter(x => x !== id));
        inputRef.current?.focus();
      });
  };

  // CLEAR COMPLETED (parallel deletes)
  const handleDeleteCompletedTodos = () => {
    setErrorMessage('');

    const ids = todos.filter(t => t.completed).map(t => t.id);

    if (ids.length === 0) {
      return;
    }

    setProcessingIds(prev => [...prev, ...ids]);

    Promise.allSettled(ids.map(id => deleteTodo(id).then(() => ({ id }))))
      .then(results => {
        const successIds = results
          .filter(r => r.status === 'fulfilled')
          .map(r => (r as PromiseFulfilledResult<{ id: number }>).value.id);

        const hasError = results.some(r => r.status === 'rejected');

        if (successIds.length > 0) {
          setTodos(prev => prev.filter(t => !successIds.includes(t.id)));
        }

        if (hasError) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !ids.includes(id)));
        inputRef.current?.focus();
      });
  };

  // PATCH (toggle + rename)
  const handlePatchTodo = (id: number, data: Todo): Promise<void> => {
    setErrorMessage('');
    setProcessingIds(prev => [...prev, id]);

    return updateTodo(id, data)
      .then(updatedFromServer => {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedFromServer : todo)),
        );
      })
      .catch(() => {
        showError('Unable to update a todo');

        return Promise.reject();
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(x => x !== id));
      });
  };

  // TOGGLE ALL
  const handleToggleTodos = (completed: boolean) => {
    setErrorMessage('');

    const toUpdate = todos.filter(t => t.completed !== completed);
    const ids = toUpdate.map(t => t.id);

    if (ids.length === 0) {
      return;
    }

    setProcessingIds(prev => [...prev, ...ids]);

    Promise.allSettled(toUpdate.map(t => updateTodo(t.id, { ...t, completed })))
      .then(results => {
        const hasError = results.some(r => r.status === 'rejected');

        const updatedTodos = results
          .filter(r => r.status === 'fulfilled')
          .map(r => (r as PromiseFulfilledResult<Todo>).value);

        if (updatedTodos.length > 0) {
          setTodos(prev =>
            prev.map(t => updatedTodos.find(u => u.id === t.id) ?? t),
          );
        }

        if (hasError) {
          showError('Unable to update a todo');
        }
      })
      .finally(() => {
        setProcessingIds(prev => prev.filter(id => !ids.includes(id)));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={inputRef}
          onCreateTodo={handleCreateTodo}
          onToggleTodos={handleToggleTodos}
          todosCountInfo={[todos.length, activeCount]}
        />

        {todos.length > 0 && (
          <TodoList
            visibleTodos={visibleTodos}
            onDelete={handleDeleteTodo}
            processingIds={processingIds}
            onPatch={handlePatchTodo}
          />
        )}

        {tempTodo && (
          <TodoItem
            todo={tempTodo}
            onDelete={handleDeleteTodo}
            isLoading
            onPatch={handlePatchTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedTodos={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onDeleteCompletedTodo={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseError={closeError}
      />
    </div>
  );
};
