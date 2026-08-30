/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './constants';
import { getTodos } from './api/todos';
import { postTodos } from './api/todos';
import { deleteTodo } from './api/todos';
import { updateTodo } from './api/todos';
import { Todo } from './types/Todo';
import './styles/filter.scss';
import './styles/index.scss';
import './styles/todo.scss';
import './styles/todoapp.scss';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [newTodoField, setNewTodoField] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isEscPressed = useRef(false);
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [updateTodoId, setUpdateTodoId] = useState<number | null>(null);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTodoField, setEditTodoField] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage('');
    getTodos(USER_ID)
      .then(result => {
        setTodos(result);
        setLoading(false);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setLoading(false);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isCreating && !loading) {
        inputRef.current?.focus();
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isCreating, loading, todos.length]);

  let filteredTodos = todos;

  if (filter === 'active') {
    filteredTodos = todos.filter(todo => todo.completed === false);
  }

  if (filter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed === true);
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed === true);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const successfulTodoIds = results
          .map((result, index) => {
            if (result.status === 'fulfilled') {
              return completedTodos[index].id;
            }

            return null;
          })
          .filter(id => id !== null);

        setTodos(todos.filter(todo => !successfulTodoIds.includes(todo.id)));

        const hasError = results.some(result => result.status === 'rejected');

        if (hasError) {
          setErrorMessage('Unable to delete a todo');
          setTimeout(() => {
            setErrorMessage('');
          }, 3000);
        }
      },
    );
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {loading ? (
        <div className="loader" />
      ) : (
        <div className="todoapp__content">
          <header className="todoapp__header">
            {todos.length > 0 && (
              <button
                type="button"
                className={
                  todos.every(todo => todo.completed === true)
                    ? 'todoapp__toggle-all active'
                    : 'todoapp__toggle-all'
                }
                data-cy="ToggleAllButton"
                onClick={() => {
                  const newStatus = !todos.every(
                    todo => todo.completed === true,
                  );

                  const todosToUpdate = todos.filter(
                    todo => todo.completed !== newStatus,
                  );

                  Promise.allSettled(
                    todosToUpdate.map(todo =>
                      updateTodo(todo.id, { completed: newStatus }),
                    ),
                  ).then(results => {
                    const newResult = results.every(
                      result => result.status === 'fulfilled',
                    );

                    if (newResult) {
                      setTodos(
                        todos.map(todo => ({
                          ...todo,
                          completed: newStatus,
                        })),
                      );
                    } else {
                      setErrorMessage('Unable to update a todo');
                      setUpdateTodoId(null);
                    }
                  });
                }}
              />
            )}

            <form
              onSubmit={event => {
                event.preventDefault();

                if (isCreating) {
                  return;
                }

                const trimNewTodoField = newTodoField.trim();

                if (trimNewTodoField === '') {
                  setErrorMessage('Title should not be empty');
                  setTimeout(() => {
                    setErrorMessage('');
                  }, 3000);

                  inputRef.current?.focus();

                  return;
                }

                const newTodo = {
                  userId: USER_ID,
                  title: trimNewTodoField,
                  completed: false,
                };

                setTempTodo({
                  id: 0,
                  userId: USER_ID,
                  title: trimNewTodoField,
                  completed: false,
                });

                setIsCreating(true);

                postTodos(newTodo)
                  .then(todo => {
                    setTodos([...todos, todo]);
                    setTempTodo(null);
                    setNewTodoField('');
                    inputRef.current?.focus();
                  })

                  .catch(() => {
                    setErrorMessage('Unable to add a todo');

                    setTimeout(() => {
                      setErrorMessage('');
                    }, 3000);

                    setTempTodo(null);
                    setNewTodoField(trimNewTodoField);
                    inputRef.current?.focus();
                  })

                  .finally(() => {
                    setTempTodo(null);
                    setIsCreating(false);
                  });
              }}
            >
              <input
                ref={inputRef}
                autoFocus
                disabled={isCreating}
                onChange={event => {
                  setNewTodoField(event.target.value);
                }}
                value={newTodoField}
                data-cy="NewTodoField"
                type="text"
                className="todoapp__new-todo"
                placeholder="What needs to be done?"
              />
            </form>
          </header>

          {todos.length > 0 && (
            <>
              <section className="todoapp__main" data-cy="TodoList">
                {filteredTodos.map(todo => (
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
                        onChange={() => {
                          setUpdateTodoId(todo.id);
                          updateTodo(todo.id, {
                            completed: !todo.completed,
                          })
                            .then(() => {
                              setTodos(
                                todos.map(todoItem => {
                                  /* eslint-disable @typescript-eslint/indent, prettier/prettier, max-len */
                                  return todoItem.id === todo.id
                                    ? {
                                        ...todoItem,
                                        completed: !todoItem.completed,
                                      }
                                    : todoItem;
                                  /* eslint-enable @typescript-eslint/indent, prettier/prettier, max-len */
                                }),
                              );
                              setUpdateTodoId(null);
                            })

                            .catch(() => {
                              setErrorMessage('Unable to update a todo');
                              setUpdateTodoId(null);

                              setTimeout(() => {
                                setErrorMessage('');
                              }, 3000);
                            });
                        }}
                      />
                    </label>

                    {editingTodoId === todo.id ? (
                      <form
                        onSubmit={event => {
                          event.preventDefault();

                          if (editTodoField.trim() === '') {
                            setDeletingTodoId(todo.id);
                            deleteTodo(todo.id)
                              .then(() => {
                                setTodos(
                                  todos.filter(
                                    todoItem => todoItem.id !== todo.id,
                                  ),
                                );

                                setEditingTodoId(null);
                              })
                              .catch(() => {
                                setErrorMessage('Unable to delete a todo');

                                setTimeout(() => {
                                  setErrorMessage('');
                                }, 3000);
                              });

                            return;
                          }

                          if (editTodoField === todo.title) {
                            setEditingTodoId(null);

                            return;
                          }

                          setUpdateTodoId(todo.id);
                          updateTodo(todo.id, { title: editTodoField.trim() })
                            .then(() => {
                              setTodos(
                                todos.map(todoItem => {
                                  /* eslint-disable @typescript-eslint/indent, prettier/prettier, max-len */
                                  return todoItem.id === todo.id
                                    ? {
                                        ...todoItem,
                                        title: editTodoField.trim(),
                                      }
                                    : /* eslint-disable @typescript-eslint/indent, prettier/prettier, max-len */
                                      todoItem;
                                }),
                              );
                              setUpdateTodoId(null);
                              setEditingTodoId(null);
                            })

                            .catch(() => {
                              setErrorMessage('Unable to update a todo');
                              setUpdateTodoId(null);
                              setTimeout(() => {
                                setErrorMessage('');
                              }, 3000);
                            });
                        }}
                      >
                        <input
                          ref={editInputRef}
                          data-cy="TodoTitleField"
                          className="todo__title"
                          value={editTodoField}
                          onChange={event => {
                            setEditTodoField(event.target.value);
                          }}
                          onBlur={() => {
                            if (isEscPressed.current) {
                              isEscPressed.current = false;

                              return;
                            }

                            if (editTodoField.trim() === '') {
                              deleteTodo(todo.id)
                                .then(() => {
                                  setTodos(
                                    todos.filter(
                                      todoItem => todoItem.id !== todo.id,
                                    ),
                                  );

                                  setEditingTodoId(null);
                                })
                                .catch(() => {
                                  setErrorMessage('Unable to delete a todo');

                                  setTimeout(() => {
                                    setErrorMessage('');
                                  }, 3000);
                                });

                              return;
                            }

                            if (editTodoField === todo.title) {
                              setEditingTodoId(null);

                              return;
                            }

                            setUpdateTodoId(todo.id);
                            updateTodo(todo.id, { title: editTodoField.trim() })
                              .then(() => {
                                setTodos(
                                  todos.map(todoItem => {
                                    return todoItem.id === todo.id
                                      ? {
                                          ...todoItem,
                                          title: editTodoField.trim(),
                                        }
                                      : todoItem;
                                  }),
                                );
                                setUpdateTodoId(null);
                                setEditingTodoId(null);
                              })
                              .catch(() => {
                                setErrorMessage('Unable to update a todo');
                                setUpdateTodoId(null);

                                setTimeout(() => {
                                  setErrorMessage('');
                                }, 3000);
                              });
                          }}
                          onKeyUp={event => {
                            if (event.key === 'Escape') {
                              isEscPressed.current = true;
                              setEditingTodoId(null);
                            }
                          }}
                        />
                      </form>
                    ) : (
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => {
                          isEscPressed.current = false;
                          setEditingTodoId(todo.id);
                          setEditTodoField(todo.title);
                        }}
                      >
                        {todo.title}
                      </span>
                    )}

                    {editingTodoId !== todo.id && (
                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => {
                          setDeletingTodoId(todo.id);

                          deleteTodo(todo.id)
                            .then(() => {
                              setTodos(
                                todos.filter(
                                  todoItem => todoItem.id !== todo.id,
                                ),
                              );
                            })
                            .catch(() => {
                              setErrorMessage('Unable to delete a todo');
                              setTimeout(() => {
                                setErrorMessage('');
                              }, 3000);
                            })
                            .finally(() => {
                              setDeletingTodoId(null);
                              inputRef.current?.focus();
                            });
                        }}
                      >
                        ×
                      </button>
                    )}

                    <div
                      data-cy="TodoLoader"
                      className={
                        deletingTodoId === todo.id || updateTodoId === todo.id
                          ? 'modal overlay is-active'
                          : 'modal overlay'
                      }
                    >
                      <div className="modal-background has-background-white-ter" />
                      <div className="loader" />
                    </div>
                  </div>
                ))}
              </section>

              {tempTodo !== null && (
                <div data-cy="Todo" className="todo">
                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>
                </div>
              )}

              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {todos.filter(todo => todo.completed === false).length} items
                  left
                </span>

                <nav className="filter" data-cy="Filter">
                  <a
                    href="/"
                    onClick={event => {
                      event.preventDefault();
                      setFilter('all');
                    }}
                    className={
                      filter === 'all'
                        ? 'filter__link selected'
                        : 'filter__link'
                    }
                    data-cy="FilterLinkAll"
                  >
                    All
                  </a>

                  <a
                    href="/active"
                    onClick={event => {
                      event.preventDefault();
                      setFilter('active');
                    }}
                    className={
                      filter === 'active'
                        ? 'filter__link selected'
                        : 'filter__link'
                    }
                    data-cy="FilterLinkActive"
                  >
                    Active
                  </a>

                  <a
                    href="/completed"
                    onClick={event => {
                      event.preventDefault();
                      setFilter('completed');
                    }}
                    className={
                      filter === 'completed'
                        ? 'filter__link selected'
                        : 'filter__link'
                    }
                    data-cy="FilterLinkCompleted"
                  >
                    Completed
                  </a>
                </nav>

                <button
                  type="button"
                  disabled={!todos.some(todo => todo.completed === true)}
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            </>
          )}
        </div>
      )}

      <div
        data-cy="ErrorNotification"
        className={
          errorMessage
            ? 'notification is-danger is-light has-text-weight-normal'
            : 'notification is-danger is-light has-text-weight-normal hidden'
        }
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
