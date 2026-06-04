/* eslint-disable max-len */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { USER_ID } from '../src/api/todos';
import * as postService from '../src/api/todos';
import classNames from 'classnames';

enum FilterStatus {
  All = '',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  Update = 'Unable to update a todo',
  EmptyTitle = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [filter, setFilter] = useState(FilterStatus.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const isSavingRef = useRef<Record<number, boolean>>({});
  const editInputRef = useRef<HTMLInputElement>(null);

  const startEditing = (todo: Todo) => {
    isSavingRef.current[todo.id] = false;
    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  useEffect(() => {
    setErrorMessage(null);

    postService
      .getTodos()
      .then(loadedTodos => {
        setTodos(loadedTodos);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Load);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding && !tempTodo && editingTodoId === null) {
      inputRef.current?.focus();
    }
  }, [isAdding, tempTodo, editingTodoId]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const activeTodosCount = todos.filter(t => !t.completed).length;
  const hasCompletedTodos = todos.some(t => t.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === FilterStatus.Active) {
      return !todo.completed;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed;
    }

    return true;
  });

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.EmptyTitle);

      return;
    }

    setIsAdding(true);
    setProcessingIds(current => [...current, 0]);

    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    postService
      .createTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(current => [...current, newTodo]);
        setInputValue('');
        setTempTodo(null);
        setIsAdding(false);
        setProcessingIds(current => current.filter(pid => pid !== 0));
        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Add);
        setTempTodo(null);
        setIsAdding(false);
        setProcessingIds(current => current.filter(pid => pid !== 0));
      });
  };

  function deleteTodo(todoId: number) {
    setProcessingIds(current => [...current, todoId]);

    postService
      .deletePost(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(pid => pid !== todoId));
        inputRef.current?.focus();
      });
  }

  const toggleTodo = (todo: Todo) => {
    setProcessingIds(current => [...current, todo.id]);

    postService
      .updatePost(todo.id, { completed: !todo.completed })
      .then((updatedTodo: Todo) => {
        setTodos(current =>
          current.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        setProcessingIds(current => current.filter(pid => pid !== todo.id));
      });
  };

  const saveEdit = (todo: Todo) => {
    const trimmed = editTitle.trim();

    if (editingTodoId !== todo.id) {
      return;
    }

    if (processingIds.includes(todo.id)) {
      return;
    }

    if (trimmed === todo.title) {
      setEditingTodoId(null);

      return;
    }

    if (!trimmed) {
      isSavingRef.current[todo.id] = true;
      setProcessingIds(current => [...current, todo.id]);

      postService
        .deletePost(todo.id)
        .then(() => {
          setTodos(current => current.filter(t => t.id !== todo.id));
          setEditingTodoId(null);
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.Delete);
        })
        .finally(() => {
          isSavingRef.current[todo.id] = false;
          setProcessingIds(current => current.filter(pid => pid !== todo.id));
        });

      return;
    }

    isSavingRef.current[todo.id] = true;
    setProcessingIds(current => [...current, todo.id]);
    postService
      .updatePost(todo.id, { title: trimmed })
      .then((updatedTodo: Todo) => {
        setTodos(current =>
          current.map(t => (t.id === todo.id ? updatedTodo : t)),
        );
        setEditingTodoId(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Update);
      })
      .finally(() => {
        isSavingRef.current[todo.id] = false;
        setProcessingIds(current => current.filter(pid => pid !== todo.id));
        inputRef.current?.focus();
      });
  };

  const toggleAll = () => {
    const shouldCompleteAll = activeTodosCount > 0;

    todos.forEach(odo => {
      if (odo.completed !== shouldCompleteAll) {
        setProcessingIds(current => [...current, odo.id]);

        postService
          .updatePost(odo.id, { completed: shouldCompleteAll })
          .then((updatePost: Todo) => {
            setTodos(current =>
              current.map(t => (t.id === odo.id ? updatePost : t)),
            );
          })
          .catch(() => {
            setErrorMessage(ErrorMessage.Update);
          })
          .finally(() => {
            setProcessingIds(current => current.filter(pid => pid !== odo.id));
          });
      }
    });
  };

  const clearCompleted = () => {
    const completedIds = todos.filter(tod => tod.completed).map(tod => tod.id);

    setProcessingIds(current => [...current, ...completedIds]);

    const deletePromises = completedIds.map(todoId =>
      postService
        .deletePost(todoId)
        .then(() => ({ todoId, success: true }))
        .catch(() => ({ todoId, success: false })),
    );

    Promise.all(deletePromises).then(results => {
      const successfulIds = results
        .filter(res => res.success)
        .map(res => res.todoId);

      const hasError = results.some(res => !res.success);

      if (hasError) {
        setErrorMessage(ErrorMessage.Delete);
      }

      setTodos(current =>
        current.filter(todo => !successfulIds.includes(todo.id)),
      );

      setProcessingIds(current =>
        current.filter(pid => !completedIds.includes(pid)),
      );
      inputRef.current?.focus();
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: activeTodosCount === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          <form
            onSubmit={e => {
              e.preventDefault();
              addTodo(inputValue);
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {filteredTodos.map(tdo => {
                const isProcessing = processingIds.includes(tdo.id);
                const isEditing = editingTodoId === tdo.id;

                return (
                  <div
                    key={tdo.id}
                    data-cy="Todo"
                    className={classNames('todo', {
                      completed: tdo.completed,
                      'is-active': isProcessing,
                    })}
                  >
                    <label className="todo__status-label">
                      <input
                        data-cy="TodoStatus"
                        type="checkbox"
                        className="todo__status"
                        checked={tdo.completed}
                        onChange={() => toggleTodo(tdo)}
                        disabled={isProcessing}
                      />
                    </label>

                    {isEditing ? (
                      <form
                        onSubmit={e => {
                          e.preventDefault();
                          saveEdit(tdo);
                        }}
                      >
                        <input
                          data-cy="TodoTitleField"
                          type="text"
                          className="todo__title-field"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          onBlur={() => saveEdit(tdo)}
                          onKeyUp={e => {
                            if (e.key === 'Escape') {
                              setEditingTodoId(null);
                            }
                          }}
                          ref={editInputRef}
                          autoFocus
                        />
                      </form>
                    ) : (
                      <>
                        <span
                          data-cy="TodoTitle"
                          className="todo__title"
                          onDoubleClick={() => startEditing(tdo)}
                        >
                          {tdo.title}
                        </span>

                        <button
                          type="button"
                          className="todo__remove"
                          data-cy="TodoDelete"
                          onClick={() => deleteTodo(tdo.id)}
                          disabled={isProcessing}
                        >
                          ×
                        </button>
                      </>
                    )}

                    <div
                      data-cy="TodoLoader"
                      className={classNames('modal', 'overlay', {
                        'is-active': isProcessing,
                      })}
                    >
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  </div>
                );
              })}

              {tempTodo && (
                <div
                  data-cy="Todo"
                  className={classNames('todo', {
                    'is-active': processingIds.includes(0),
                  })}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status is-active"
                      disabled
                    />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <button type="button" className="todo__remove" disabled>
                    ×
                  </button>

                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal', 'overlay', {
                      'is-active': processingIds.includes(0),
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            {/* Hide the footer if there are no todos */}
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              {/* Active link should have the 'selected' class */}
              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filter === FilterStatus.All,
                  })}
                  data-cy="FilterLinkAll"
                  onClick={() => setFilter(FilterStatus.All)}
                >
                  All
                </a>

                <a
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filter === FilterStatus.Active,
                  })}
                  data-cy="FilterLinkActive"
                  onClick={() => setFilter(FilterStatus.Active)}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filter === FilterStatus.Completed,
                  })}
                  data-cy="FilterLinkCompleted"
                  onClick={() => setFilter(FilterStatus.Completed)}
                >
                  Completed
                </a>
              </nav>

              {/* this button should be disabled if there are no completed todos */}
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!hasCompletedTodos}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
