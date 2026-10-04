/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  TodoUpdate,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const editTitleFieldRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<number | null>(null);
  const editSavingRef = useRef(false);

  const hideError = useCallback(() => {
    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setErrorMessage('');
  }, []);

  const showError = useCallback((message: string) => {
    if (errorTimerRef.current !== null) {
      window.clearTimeout(errorTimerRef.current);
    }

    setErrorMessage(message);

    errorTimerRef.current = window.setTimeout(() => {
      setErrorMessage('');
      errorTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
  }, [showError]);

  useEffect(() => {
    if (!tempTodo) {
      newTodoFieldRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editTitleFieldRef.current?.focus();
    }
  }, [editingTodoId]);

  useEffect(() => {
    return () => {
      if (errorTimerRef.current !== null) {
        window.clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    hideError();

    const newTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTodo);

    createTodo(trimmedTitle)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const removeTodo = (
    todoId: number,
    focusNewTodoField: boolean,
  ): Promise<boolean> => {
    setDeletingTodoIds(currentIds =>
      currentIds.includes(todoId) ? currentIds : [...currentIds, todoId],
    );

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );

        return true;
      })
      .catch(() => {
        showError('Unable to delete a todo');

        return false;
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        if (focusNewTodoField) {
          newTodoFieldRef.current?.focus();
        }
      });
  };

  const handleDelete = (todoId: number) => {
    hideError();
    void removeTodo(todoId, true);
  };

  const handleClearCompleted = () => {
    hideError();

    todos
      .filter(todo => todo.completed)
      .forEach(todo => {
        void removeTodo(todo.id, true);
      });
  };

  const applyTodoUpdate = (
    todoId: number,
    changes: TodoUpdate,
  ): Promise<boolean> => {
    setUpdatingTodoIds(currentIds =>
      currentIds.includes(todoId) ? currentIds : [...currentIds, todoId],
    );

    return updateTodo(todoId, changes)
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo => {
            if (todo.id !== todoId) {
              return todo;
            }

            return {
              ...todo,
              ...(changes.title !== undefined
                ? { title: updatedTodo.title }
                : {}),
              ...(changes.completed !== undefined
                ? { completed: updatedTodo.completed }
                : {}),
            };
          }),
        );

        return true;
      })
      .catch(() => {
        showError('Unable to update a todo');

        return false;
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const handleToggle = (todo: Todo) => {
    if (
      deletingTodoIds.includes(todo.id) ||
      updatingTodoIds.includes(todo.id)
    ) {
      return;
    }

    hideError();

    void applyTodoUpdate(todo.id, {
      completed: !todo.completed,
    });
  };

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleToggleAll = () => {
    hideError();

    const targetCompleted = !allCompleted;

    todos
      .filter(todo => todo.completed !== targetCompleted)
      .forEach(todo => {
        void applyTodoUpdate(todo.id, {
          completed: targetCompleted,
        });
      });
  };

  const startEditing = (todo: Todo) => {
    if (
      deletingTodoIds.includes(todo.id) ||
      updatingTodoIds.includes(todo.id)
    ) {
      return;
    }

    editSavingRef.current = false;
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    if (editSavingRef.current) {
      return;
    }

    setEditingTodoId(null);
    setEditTitle('');
  };

  const saveEditedTodo = (todo: Todo) => {
    if (editSavingRef.current) {
      return;
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);
      setEditTitle('');

      return;
    }

    hideError();
    editSavingRef.current = true;

    if (!trimmedTitle) {
      removeTodo(todo.id, false)
        .then(wasDeleted => {
          if (wasDeleted) {
            setEditingTodoId(currentId =>
              currentId === todo.id ? null : currentId,
            );
            setEditTitle('');
          }
        })
        .finally(() => {
          editSavingRef.current = false;
        });

      return;
    }

    applyTodoUpdate(todo.id, { title: trimmedTitle })
      .then(wasUpdated => {
        if (wasUpdated) {
          setEditingTodoId(currentId =>
            currentId === todo.id ? null : currentId,
          );
          setEditTitle('');
        }
      })
      .finally(() => {
        editSavingRef.current = false;
      });
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const todosToShow = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

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
              className={
                allCompleted
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoFieldRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {todosToShow.map(todo => {
              const isEditing = editingTodoId === todo.id;
              const isDeleting = deletingTodoIds.includes(todo.id);
              const isUpdating = updatingTodoIds.includes(todo.id);
              const isProcessing = isDeleting || isUpdating;

              return (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={todo.completed ? 'todo completed' : 'todo'}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      disabled={todo.id === 0 || isProcessing}
                      onChange={() => handleToggle(todo)}
                    />
                  </label>

                  {isEditing ? (
                    <form
                      onSubmit={event => {
                        event.preventDefault();
                        saveEditedTodo(todo);
                      }}
                    >
                      <input
                        ref={editTitleFieldRef}
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        value={editTitle}
                        onChange={event => setEditTitle(event.target.value)}
                        onKeyUp={event => {
                          if (event.key === 'Escape') {
                            cancelEditing();
                          }
                        }}
                        onBlur={() => saveEditedTodo(todo)}
                      />
                    </form>
                  ) : (
                    <>
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => startEditing(todo)}
                      >
                        {todo.title}
                      </span>

                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => handleDelete(todo.id)}
                      >
                        ×
                      </button>
                    </>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${
                      todo.id === 0 || isProcessing ? 'is-active' : ''
                    }`}
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
              disabled={!hasCompletedTodos}
              onClick={handleClearCompleted}
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
          onClick={hideError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
