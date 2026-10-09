/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const editFieldRef = useRef<HTMLInputElement>(null);
  const editHandledRef = useRef<number | null>(null);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (!isAdding && editingTodoId === null) {
      newTodoFieldRef.current?.focus();
    }
  }, [isAdding, editingTodoId]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editFieldRef.current?.focus();
    }
  }, [editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodosCount = todos.filter(todo => todo.completed).length;
  const allCompleted = todos.length > 0 && completedTodosCount === todos.length;

  const toggleTodoStatus = (todo: Todo, completed: boolean) => {
    if (todo.completed === completed) {
      return;
    }

    setUpdatingTodoIds(current => [...current, todo.id]);

    updateTodo(todo.id, { completed })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(current => current.filter(id => id !== todo.id));
      });
  };

  const toggleAll = () => {
    const newStatus = !allCompleted;
    const changedTodos = todos.filter(todo => todo.completed !== newStatus);

    changedTodos.forEach(todo => {
      toggleTodoStatus(todo, newStatus);
    });
  };

  const removeTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(null);
        newTodoFieldRef.current?.focus();
      });
  };

  const startEditing = (todo: Todo) => {
    editHandledRef.current = null;
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    editHandledRef.current = editingTodoId;
    setEditingTodoId(null);
    setEditTitle('');
  };

  const saveTodo = (todo: Todo) => {
    if (editingTodoId !== todo.id || editHandledRef.current === todo.id) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (!trimmedTitle) {
      setDeletingTodoId(todo.id);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current =>
            current.filter(currentTodo => currentTodo.id !== todo.id),
          );

          setEditingTodoId(null);
          setEditTitle('');
        })
        .catch(() => {
          editHandledRef.current = null;
          setErrorMessage('Unable to delete a todo');
        })
        .finally(() => {
          setDeletingTodoId(null);
          newTodoFieldRef.current?.focus();
        });

      return;
    }

    if (trimmedTitle === todo.title) {
      editHandledRef.current = todo.id;
      setEditingTodoId(null);
      setEditTitle('');

      return;
    }

    editHandledRef.current = todo.id;
    setUpdatingTodoIds(current => [...current, todo.id]);

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
        setEditingTodoId(null);
        setEditTitle('');
        newTodoFieldRef.current?.focus();
      })
      .catch(() => {
        editHandledRef.current = null;
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        setUpdatingTodoIds(current => current.filter(id => id !== todo.id));
      });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isLoading && todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form
            onSubmit={event => {
              event.preventDefault();

              const trimmedTitle = title.trim();

              if (!trimmedTitle) {
                setErrorMessage('Title should not be empty');

                return;
              }

              const temporaryTodo: Todo = {
                id: 0,
                userId: USER_ID,
                title: trimmedTitle,
                completed: false,
              };

              setTempTodo(temporaryTodo);
              setIsAdding(true);

              createTodo(trimmedTitle)
                .then(todo => {
                  setTodos(current => [...current, todo]);
                  setTempTodo(null);
                  setTitle('');
                })
                .catch(() => {
                  setErrorMessage('Unable to add a todo');
                  setTempTodo(null);
                })
                .finally(() => {
                  setIsAdding(false);
                });
            }}
          >
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              const isUpdating = updatingTodoIds.includes(todo.id);
              const isDeleting = deletingTodoId === todo.id;
              const isBusy = isUpdating || isDeleting;
              const isEditing = editingTodoId === todo.id;

              return (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={`todo ${todo.completed ? 'completed' : ''}`}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      disabled={isBusy || isEditing}
                      onChange={event =>
                        toggleTodoStatus(todo, event.target.checked)
                      }
                    />
                  </label>

                  {isEditing ? (
                    <form
                      className="todo__form"
                      onSubmit={event => {
                        event.preventDefault();
                        saveTodo(todo);
                      }}
                    >
                      <input
                        ref={editFieldRef}
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        value={editTitle}
                        onChange={event => setEditTitle(event.target.value)}
                        onBlur={() => saveTodo(todo)}
                        onKeyUp={event => {
                          if (event.key === 'Escape') {
                            event.preventDefault();
                            cancelEditing();
                          }
                        }}
                      />
                    </form>
                  ) : (
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        if (!isBusy) {
                          startEditing(todo);
                        }
                      }}
                    >
                      {todo.title}
                    </span>
                  )}

                  {!isEditing && (
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      disabled={isBusy}
                      onClick={() => removeTodo(todo.id)}
                    >
                      ×
                    </button>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${isBusy ? 'is-active' : ''}`}
                  >
                    <div
                      className="modal-background
                      has-background-white-ter"
                    />

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
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filter === 'active' ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filter === 'completed' ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={() => {
                const completedTodos = todos.filter(todo => todo.completed);

                Promise.allSettled(
                  completedTodos.map(todo => deleteTodo(todo.id)),
                ).then(results => {
                  const successfullyDeletedIds = completedTodos
                    .filter((_, index) => results[index].status === 'fulfilled')
                    .map(todo => todo.id);

                  setTodos(current =>
                    current.filter(
                      todo => !successfullyDeletedIds.includes(todo.id),
                    ),
                  );

                  if (results.some(result => result.status === 'rejected')) {
                    setErrorMessage('Unable to delete a todo');
                  }

                  newTodoFieldRef.current?.focus();
                });
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${
          errorMessage ? '' : 'hidden'
        }`}
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
