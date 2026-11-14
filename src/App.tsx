/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { TodoItem } from './components/TodoItem';
import type { Todo } from './types/Todo';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const processingRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    let cancelled = false;

    getTodos()
      .then(data => {
        if (!cancelled) {
          setTodos(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Unable to load todos');
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError('');
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error]);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const startProcessing = (id: number) => {
    if (processingRef.current.has(id)) {
      return false;
    }

    processingRef.current.add(id);
    setProcessingIds(ids => [...ids, id]);

    return true;
  };

  const stopProcessing = (id: number) => {
    processingRef.current.delete(id);

    setProcessingIds(ids => ids.filter(item => item !== id));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Title should not be empty');
      inputRef.current?.focus();

      return;
    }

    setError('');
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    });

    try {
      const createdTodo = await addTodo(trimmedTitle);

      setTodos(current => [...current, createdTodo]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number): Promise<void> => {
    if (!startProcessing(id)) {
      return;
    }

    setError('');

    try {
      await deleteTodo(id);

      setTodos(current => current.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');

      throw new Error('Unable to delete a todo');
    } finally {
      stopProcessing(id);
      inputRef.current?.focus();
    }
  };

  const handleUpdate = async (
    todo: Todo,
    changes: Partial<Pick<Todo, 'title' | 'completed'>>,
  ): Promise<void> => {
    if (!startProcessing(todo.id)) {
      return;
    }

    setError('');

    try {
      const updatedTodo = await updateTodo(todo.id, changes);

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      setError('Unable to update a todo');

      throw new Error('Unable to update a todo');
    } finally {
      stopProcessing(todo.id);
    }
  };

  const handleToggle = async (todo: Todo): Promise<void> => {
    try {
      await handleUpdate(todo, {
        completed: !todo.completed,
      });
    } catch {
      // The notification is handled in handleUpdate.
    }
  };

  const handleRename = async (todo: Todo, newTitle: string): Promise<void> => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      return;
    }

    if (!trimmedTitle) {
      await handleDelete(todo.id);

      return;
    }

    await handleUpdate(todo, {
      title: trimmedTitle,
    });
  };

  const handleToggleAll = async () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    await Promise.all(todosToUpdate.map(todo => handleToggle(todo)));
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(todo => handleDelete(todo.id).catch(() => {})),
    );
  };

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

  const activeCount = todos.filter(todo => !todo.completed).length;

  const completedCount = todos.length - activeCount;
  const allCompleted = todos.length > 0 && activeCount === 0;

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
              data-cy="ToggleAllButton"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              onClick={() => {
                void handleToggleAll();
              }}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isAdding}
              onChange={event => setTitle(event.target.value)}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isProcessed={processingIds.includes(todo.id)}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onRename={handleRename}
              />
            ))}

            {tempTodo && <TodoItem key={0} todo={tempTodo} isProcessed />}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                data-cy="FilterLinkAll"
                className={classNames('filter__link', {
                  selected: filter === Filter.All,
                })}
                onClick={() => setFilter(Filter.All)}
              >
                All
              </a>

              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={classNames('filter__link', {
                  selected: filter === Filter.Active,
                })}
                onClick={() => setFilter(Filter.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={classNames('filter__link', {
                  selected: filter === Filter.Completed,
                })}
                onClick={() => setFilter(Filter.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              data-cy="ClearCompletedButton"
              className="todoapp__clear-completed"
              disabled={completedCount === 0}
              onClick={() => {
                void clearCompleted();
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </div>
  );
};
