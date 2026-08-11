/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, updateTodo } from './api/todos';
import { UserWarning } from './UserWarning';

const USER_ID = 4412;

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  Load = 'Unable to load todos',
  Add = 'Unable to add a todo',
  Delete = 'Unable to delete a todo',
  EmptyTitle = 'Title should not be empty',
  Update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isClearing, setIsClearing] = useState(false);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const isEscPressed = useRef(false);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const filters = [
    {
      label: 'All',
      value: Filter.All,
      href: '#/',
      dataCy: 'FilterLinkAll',
    },
    {
      label: 'Active',
      value: Filter.Active,
      href: '#/active',
      dataCy: 'FilterLinkActive',
    },
    {
      label: 'Completed',
      value: Filter.Completed,
      href: '#/completed',
      dataCy: 'FilterLinkCompleted',
    },
  ];

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

  const showError = (message: string) => {
    setError(message);

    setTimeout(() => {
      setError('');
    }, 3000);
  };

  const loadTodos = () => {
    setError('');
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    if (tempTodo === null) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingTodoId]);

  const removeTodo = (todoId: number) => {
    setDeletingTodoIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Delete);
      })
      .finally(() => {
        setDeletingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );

        inputRef.current?.focus();
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.EmptyTitle);

      return;
    }

    const newTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);

    addTodo({
      title: trimmedTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(todo => {
        setTodos(currentTodos => [...currentTodos, todo]);
        setTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.Add);
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const clearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setIsClearing(true);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successfullyDeletedIds = completedTodos
          .filter((_, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(currentTodos =>
          currentTodos.filter(
            todo => !successfullyDeletedIds.includes(todo.id),
          ),
        );

        if (results.some(result => result.status === 'rejected')) {
          showError(ErrorMessage.Delete);
        }
      })
      .finally(() => {
        setIsClearing(false);
        inputRef.current?.focus();
      });
  };

  const changeTodoStatus = (todoId: number, completed: boolean) => {
    setUpdatingTodoIds(currentIds => [...currentIds, todoId]);

    updateTodo(todoId, { completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(todo =>
            todo.id === updatedTodo.id ? updatedTodo : todo,
          ),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
      });
  };

  const toggleAll = () => {
    const newCompletedStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newCompletedStatus,
    );

    todosToUpdate.forEach(todo => {
      changeTodoStatus(todo.id, newCompletedStatus);
    });
  };

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const saveEditing = (todo: Todo) => {
    const trimmedTitle = editingTitle.trim();

    if (!trimmedTitle) {
      removeTodo(todo.id);

      return;
    }

    if (trimmedTitle === todo.title) {
      setEditingTodoId(null);

      return;
    }

    setUpdatingTodoIds(currentIds => [...currentIds, todo.id]);

    updateTodo(todo.id, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === updatedTodo.id ? updatedTodo : currentTodo,
          ),
        );

        setEditingTodoId(null);
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setUpdatingTodoIds(currentIds =>
          currentIds.filter(id => id !== todo.id),
        );
      });
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
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
                active: allCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
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
              onChange={event => setTitle(event.target.value)}
              disabled={tempTodo !== null}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={classNames('todo', {
                    completed: todo.completed,
                  })}
                >
                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active':
                        deletingTodoIds.includes(todo.id) ||
                        updatingTodoIds.includes(todo.id),
                    })}
                  >
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>

                  <label
                    className="todo__status-label"
                    htmlFor={`todo-${todo.id}`}
                  >
                    <input
                      id={`todo-${todo.id}`}
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() =>
                        changeTodoStatus(todo.id, !todo.completed)
                      }
                    />
                  </label>

                  {editingTodoId === todo.id ? (
                    <form
                      onSubmit={event => {
                        event.preventDefault();
                        saveEditing(todo);
                      }}
                    >
                      <input
                        ref={editInputRef}
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        value={editingTitle}
                        onChange={event => setEditingTitle(event.target.value)}
                        onBlur={() => {
                          if (!isEscPressed.current) {
                            saveEditing(todo);
                          }

                          isEscPressed.current = false;
                        }}
                        onKeyUp={event => {
                          if (event.key === 'Escape') {
                            isEscPressed.current = true;
                            cancelEditing();
                          }
                        }}
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
                        onClick={() => removeTodo(todo.id)}
                      >
                        ×
                      </button>
                    </>
                  )}
                </div>
              ))}

              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div className="modal-background has-background-white-ter" />
                    <div className="loader" />
                  </div>

                  <label className="todo__status-label" htmlFor="todo-temp">
                    <input
                      id="todo-temp"
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
                </div>
              )}
            </section>

            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {todos.filter(todo => !todo.completed).length} items left
                </span>

                <nav className="filter" data-cy="Filter">
                  {filters.map(({ label, value, href, dataCy }) => (
                    <a
                      key={value}
                      href={href}
                      className={classNames('filter__link', {
                        selected: filter === value,
                      })}
                      data-cy={dataCy}
                      onClick={() => setFilter(value)}
                    >
                      {label}
                    </a>
                  ))}
                </nav>

                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={!todos.some(todo => todo.completed)}
                  onClick={clearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />

        {error}
      </div>
    </div>
  );
};
