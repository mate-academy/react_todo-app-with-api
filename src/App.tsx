/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Todo, FilterType } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);
  const [query, setQuery] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [updatingIds, setUpdatingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompletedTodos = todos.some(t => t.completed);
  const isAllCompleted = todos.length > 0 && activeTodosCount === 0;

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        case FilterType.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting]);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = query.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    addTodo({ userId: USER_ID, title: trimmedTitle, completed: false })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setQuery('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    return deleteTodo(todoId)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        throw new Error();
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleUpdateTodo = (todoId: number, fields: Partial<Todo>) => {
    setUpdatingIds(prev => [...prev, todoId]);
    setErrorMessage('');

    return updateTodo(todoId, fields)
      .then(updatedTodo => {
        setTodos(prev => prev.map(t => (t.id === todoId ? updatedTodo : t)));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        throw new Error();
      })
      .finally(() => {
        setUpdatingIds(prev => prev.filter(id => id !== todoId));
      });
  };

  const handleToggleAll = () => {
    const targetStatus = !isAllCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== targetStatus);

    todosToUpdate.forEach(todo => {
      handleUpdateTodo(todo.id, { completed: targetStatus }).catch(() => {});
    });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(t => t.completed);

    completedTodos.forEach(todo => {
      handleDeleteTodo(todo.id).catch(() => {});
    });
  };

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
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={e => setQuery(e.target.value)}
              disabled={isSubmitting}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <TodoList
              todos={filteredTodos}
              deletingIds={deletingIds}
              updatingIds={updatingIds}
              onDelete={handleDeleteTodo}
              onUpdate={handleUpdateTodo}
              tempTodo={tempTodo}
            />

            {todos.length > 0 && (
              <TodoFilter
                activeCount={activeTodosCount}
                currentFilter={filter}
                onFilterChange={setFilter}
                hasCompleted={hasCompletedTodos}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
