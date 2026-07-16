/* eslint-disable jsx-a11y/label-has-associated-control */
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
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';

type FilterStatus = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMsg, setErrorMsg] = useState<ErrorMessage>(ErrorMessage.NoError);
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);

  const showError = (message: ErrorMessage) => {
    setErrorMsg(message);
    if (errorTimerRef.current) {
      window.clearTimeout(errorTimerRef.current);
    }

    errorTimerRef.current = window.setTimeout(() => {
      setErrorMsg(ErrorMessage.NoError);
    }, 3000);
  };

  useEffect(() => {
    setErrorMsg(ErrorMessage.NoError);
    getTodos()
      .then(setTodos)
      .catch(() => showError(ErrorMessage.UnableToLoad));
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, todos]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();

    if (!trimmed) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    setIsSubmitting(true);
    setErrorMsg(ErrorMessage.NoError);

    const temp: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmed,
      completed: false,
    };

    setTempTodo(temp);

    addTodo(trimmed)
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setTitle('');
      })
      .catch(() => showError(ErrorMessage.UnableToAdd))
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(t => t.id !== id));
      })
      .catch(() => {
        showError(ErrorMessage.UnableToDelete);
        throw new Error();
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(i => i !== id));
      });
  };

  const handleDeleteClick = (id: number) => {
    handleDelete(id)
      .then(() => inputRef.current?.focus())
      .catch(() => {});
  };

  const handleClearCompleted = () => {
    const completed = todos.filter(t => t.completed);

    Promise.allSettled(completed.map(todo => handleDelete(todo.id))).then(() =>
      inputRef.current?.focus(),
    );
  };

  const handleToggle = (todo: Todo) => {
    setLoadingIds(prev => [...prev, todo.id]);

    return updateTodo(todo.id, { completed: !todo.completed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(() => showError(ErrorMessage.UnableToUpdate))
      .finally(() => {
        setLoadingIds(prev => prev.filter(i => i !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(t => t.completed);
    const toToggle = allCompleted ? todos : todos.filter(t => !t.completed);

    toToggle.forEach(todo => handleToggle(todo));
  };

  const handleDoubleClick = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const handleEditSave = (todo: Todo) => {
    const trimmed = editTitle.trim();

    if (trimmed === todo.title) {
      setEditingId(null);

      return;
    }

    if (!trimmed) {
      handleDelete(todo.id)
        .then(() => setEditingId(null))
        .catch(() => {});

      return;
    }

    setLoadingIds(prev => [...prev, todo.id]);

    updateTodo(todo.id, { title: trimmed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
        setEditingId(null);
      })
      .catch(() => showError(ErrorMessage.UnableToUpdate))
      .finally(() => {
        setLoadingIds(prev => prev.filter(i => i !== todo.id));
      });
  };

  const handleEditKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  const handleFilterAll = () => setFilter('all');
  const handleFilterActive = () => setFilter('active');
  const handleFilterCompleted = () => setFilter('completed');
  const handleHideError = () => setErrorMsg(ErrorMessage.NoError);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);
  const allCompleted = todos.length > 0 && todos.every(t => t.completed);
  const modalBgClass = 'modal-background has-background-white-ter';

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
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
              onChange={e => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(todo => {
                const isLoading = loadingIds.includes(todo.id);
                const isEditing = editingId === todo.id;

                return (
                  <div
                    key={todo.id}
                    data-cy="Todo"
                    className={classNames('todo', {
                      completed: todo.completed,
                    })}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo)}
                      />
                    </label>

                    {isEditing ? (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          handleEditSave(todo);
                        }}
                      >
                        <input
                          ref={editInputRef}
                          data-cy="TodoTitleField"
                          type="text"
                          className="todo__title-field"
                          placeholder="Empty todo will be deleted"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onBlur={() => handleEditSave(todo)}
                          onKeyUp={handleEditKeyUp}
                        />
                      </form>
                    ) : (
                      <>
                        <span
                          data-cy="TodoTitle"
                          className="todo__title"
                          onDoubleClick={() => handleDoubleClick(todo)}
                        >
                          {todo.title}
                        </span>

                        <button
                          type="button"
                          className="todo__remove"
                          data-cy="TodoDelete"
                          onClick={() => handleDeleteClick(todo.id)}
                        >
                          ×
                        </button>
                      </>
                    )}

                    <div
                      data-cy="TodoLoader"
                      className={classNames('modal', 'overlay', {
                        'is-active': isLoading,
                      })}
                    >
                      <div className={modalBgClass} />
                      <div className="loader" />
                    </div>
                  </div>
                );
              })}

              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={false}
                      readOnly
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                  >
                    ×
                  </button>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className={modalBgClass} />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filter === 'all',
                  })}
                  data-cy="FilterLinkAll"
                  onClick={handleFilterAll}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filter === 'active',
                  })}
                  data-cy="FilterLinkActive"
                  onClick={handleFilterActive}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filter === 'completed',
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={handleFilterCompleted}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompleted}
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMsg },
        )}
      >
        <button
          data-cy="HideErrorButton" // test
          type="button"
          className="delete"
          onClick={handleHideError}
        />
        {errorMsg}
      </div>
    </div>
  );
};
