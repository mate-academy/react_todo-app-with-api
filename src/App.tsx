/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';

const USER_ID = todoService.USER_ID || 0;

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!isAdding && editingId === null) {
      inputRef.current?.focus();
    }
  }, [todos.length, errorMessage, isAdding, editingId]);

  const completedTodos = useMemo(() => todos.filter(t => t.completed), [todos]);
  const activeCount = todos.length - completedTodos.length;

  const visibleTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(t => !t.completed);
      case 'completed':
        return todos.filter(t => t.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  const toggleTodo = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .updateTodo({
        ...todo,
        completed: !todo.completed,
      })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const removeTodo = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setLoadingIds(prev => prev.filter(x => x !== id));
      });
  };

  const updateTitle = (todo: Todo) => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmedTitle) {
      removeTodo(todo.id);

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);

    todoService
      .updateTodo({ ...todo, title: trimmedTitle })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
        setEditingId(null);
      })
      .catch(() => showError('Unable to update a todo'))
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todo.id));
      });
  };

  const toggleAll = () => {
    const newStatus = activeCount > 0;
    const todosToUpdate = todos.filter(t => t.completed !== newStatus);

    todosToUpdate.forEach(toggleTodo);
  };

  const clearCompleted = () => {
    completedTodos.forEach(todo => removeTodo(todo.id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newTitle.trim();

    if (!trimmed) {
      showError('Title should not be empty');

      return;
    }

    setIsAdding(true);

    todoService
      .createTodo({
        title: trimmed,
        completed: false,
        userId: USER_ID,
      })
      .then(created => {
        setTodos(prev => [...prev, created]);
        setNewTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => setIsAdding(false));
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
                active: activeCount === 0,
              })}
              aria-label="Toggle all todos"
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              aria-label="New todo title"
              ref={inputRef}
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            const isLoading = loadingIds.includes(todo.id);
            const isEditing = editingId === todo.id;
            const todoId = `todo-status-${todo.id}`;

            return (
              <div
                key={todo.id}
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                  editing: isEditing,
                })}
              >
                <label className="todo__status-label" htmlFor={todoId}>
                  <input
                    id={todoId}
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                    aria-label="Toggle todo status"
                  />
                </label>

                {isEditing ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      updateTitle(todo);
                    }}
                  >
                    <input
                      autoFocus
                      data-cy="TodoTitleField"
                      className="todo__title-field"
                      aria-label="Edit todo title"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onBlur={() => updateTitle(todo)}
                      onKeyUp={e => {
                        if (e.key === 'Escape') {
                          setEditingId(null);
                        }
                      }}
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setEditingId(todo.id);
                        setEditTitle(todo.title);
                      }}
                    >
                      {todo.title}
                    </span>
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      aria-label="Delete todo"
                      onClick={() => removeTodo(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': isLoading,
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {isAdding && (
            <div data-cy="Todo" className="todo">
              <label className="todo__status-label">
                <input
                  type="checkbox"
                  className="todo__status"
                  disabled
                  aria-label="Toggle status"
                />
              </label>
              <span data-cy="TodoTitle" className="todo__title">
                {newTitle}
              </span>
              <div data-cy="TodoLoader" className="modal overlay is-active">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

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
                  selected: filter === 'all',
                })}
                onClick={() => setFilter('all')}
              >
                All
              </a>
              <a
                href="#/active"
                data-cy="FilterLinkActive"
                className={classNames('filter__link', {
                  selected: filter === 'active',
                })}
                onClick={() => setFilter('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                data-cy="FilterLinkCompleted"
                className={classNames('filter__link', {
                  selected: filter === 'completed',
                })}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
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
          type="button"
          data-cy="HideErrorButton"
          className="delete"
          aria-label="Hide notification"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
      </div>
    </div>
  );
};
