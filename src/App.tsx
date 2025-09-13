/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList';
import { Notification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { NewTodo } from './components/NewTodo';
import classNames from 'classnames';
import { ErrorMessages } from './constants/ErrorMessages';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [todosToProcessIds, setTodosToProcessIds] = useState<Set<number>>(
    new Set(),
  );
  const [shouldFocus, setShouldFocus] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const incompleteCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError(ErrorMessages.LOAD_TODOS);
      });
  }, []);

  useEffect(() => {
    if (shouldFocus) {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    setShouldFocus(false);
  }, [shouldFocus]);

  const handleToggleAll = async () => {
    setError('');
    setLoading(true);

    const completed = todos.some(todo => !todo.completed);

    const todosToChange = todos.filter(todo => todo.completed !== completed);

    if (todosToChange.length === 0 || todos.length === 0) {
      setLoading(false);

      return;
    }

    setTodosToProcessIds(new Set(todosToChange.map(todo => todo.id)));

    try {
      const updatePromises = todosToChange.map(todo =>
        updateTodo(todo.id, { completed }).then(() => todo.id),
      );

      const results = await Promise.allSettled(updatePromises);

      const { successfullyUpdatedIds, failedUpdatesIds } = results.reduce(
        (acc, result) => {
          if (result.status === 'fulfilled') {
            acc.successfullyUpdatedIds.push(result.value);
          } else {
            acc.failedUpdatesIds.push(result.reason);
          }

          return acc;
        },
        {
          successfullyUpdatedIds: [] as number[],
          failedUpdatesIds: [] as number[],
        },
      );

      setTodos(prev =>
        prev.map(todo =>
          successfullyUpdatedIds.includes(todo.id)
            ? { ...todo, completed: completed }
            : todo,
        ),
      );

      if (failedUpdatesIds.length > 0) {
        setError(ErrorMessages.UPDATE_TODO);
      }
    } finally {
      setLoading(false);
      setTodosToProcessIds(new Set());
    }
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setError('');
    setLoading(true);
    setTodosToProcessIds(new Set(completedTodos.map(todo => todo.id)));

    try {
      const deletePromises = completedTodos.map(todo =>
        deleteTodo(todo.id).then(() => todo.id),
      );

      const results = await Promise.allSettled(deletePromises);
      const successfullyDeletedIds: number[] = [];
      const failedDeletions: number[] = [];

      for (const result of results) {
        if (result.status === 'fulfilled') {
          successfullyDeletedIds.push(result.value);
        } else {
          failedDeletions.push(result.reason);
        }
      }

      setTodos(prev =>
        prev.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      if (failedDeletions.length > 0) {
        setError(ErrorMessages.DELETE_TODO);
      }
    } finally {
      setLoading(false);
      setTodosToProcessIds(new Set());
      setShouldFocus(true);
    }
  };

  function handleCreateTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
    setError('');
    setLoading(true);

    addTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setInputValue('');
      })
      .catch(() => {
        setError(ErrorMessages.ADD_TODO);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setShouldFocus(true);
      });
  }

  function handleDeleteTodo(todoId: number) {
    setError('');
    setTodosToProcessIds(prevTodosToProcess => prevTodosToProcess.add(todoId));
    setLoading(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setError(ErrorMessages.DELETE_TODO);
      })
      .finally(() => {
        setLoading(false);
        setTodosToProcessIds(prevTodosToProcess => {
          const newSet = new Set(prevTodosToProcess);

          newSet.delete(todoId);

          return newSet;
        });
        setShouldFocus(true);
      });
  }

  function handleTodoUpdate(todoId: number, data: Partial<Todo>) {
    setError('');
    setLoading(true);
    setTodosToProcessIds(prev => new Set(prev).add(todoId));

    return updateTodo(todoId, data)
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === todoId ? updatedTodo : todo)),
        );
      })
      .catch(errorMessage => {
        setError(ErrorMessages.UPDATE_TODO);
        throw errorMessage;
      })
      .finally(() => {
        setLoading(false);
        setTodosToProcessIds(prev => {
          const newSet = new Set(prev);

          newSet.delete(todoId);

          return newSet;
        });
      });
  }

  function handleStatusChange(todoId: number) {
    const todo = todos.find(t => t.id === todoId);

    if (!todo) {
      return;
    }

    const completed = !todo.completed;

    setError('');
    setLoading(true);
    setTodosToProcessIds(prevTodosToProcess => prevTodosToProcess.add(todoId));
    updateTodo(todoId, { completed })
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
      })
      .catch(() => {
        setError(ErrorMessages.UPDATE_TODO);
      })
      .finally(() => {
        setLoading(false);
        setTodosToProcessIds(prevTodosToProcess => {
          const newSet = new Set(prevTodosToProcess);

          newSet.delete(todoId);

          return newSet;
        });
      });
  }

  const handleValidationError = (errorMessage: string) => {
    setError(errorMessage);
    setShouldFocus(true);
  };

  const allIsCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hideNotification = () => {
    setError('');
  };

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allIsCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            onSubmit={handleCreateTodo}
            setTempTodo={setTempTodo}
            disabled={loading}
            inputRef={inputRef}
            inputValue={inputValue}
            onInputChange={setInputValue}
            onError={handleValidationError}
          />
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          loading={loading}
          onDelete={handleDeleteTodo}
          todosToDelete={todosToProcessIds}
          onStatusChange={handleStatusChange}
          onUpdate={handleTodoUpdate}
        />
        {todos.length > 0 && (
          <Footer
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            incompleteCount={incompleteCount}
            hasCompletedTodos={hasCompletedTodos}
          />
        )}
      </div>
      <Notification message={error} onHide={hideNotification} />
    </div>
  );
};
