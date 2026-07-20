/* eslint-disable jsx-a11y/label-has-associated-control */
import { FormEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import {
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

export const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState(Filter.All);
  const [error, setError] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  function loadTodos() {
    setIsLoading(true);
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timer = setTimeout(() => {
      setError('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    if (!tempTodo) {
      inputRef.current?.focus();
    }
  }, [tempTodo]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingId]);

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

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodos = todos.filter(todo => todo.completed);

  const allCompleted =
    todos.length > 0 && completedTodos.length === todos.length;

  const itemsText = activeTodosCount === 1 ? 'item' : 'items';

  const addLoadingId = (id: number) => {
    setLoadingIds(current =>
      current.includes(id) ? current : [...current, id],
    );
  };

  const removeLoadingId = (id: number) => {
    setLoadingIds(current => current.filter(item => item !== id));
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const title = query.trim();

    if (!title) {
      setError('Title should not be empty');

      return;
    }

    const todo: Todo = {
      id: 0,
      title,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(todo);

    addTodo({
      title,
      completed: false,
      userId: USER_ID,
    })
      .then(createdTodo => {
        setTodos(current => [...current, createdTodo]);

        setQuery('');
      })
      .catch(() => {
        setError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    addLoadingId(id);

    deleteTodo(id)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== id));
      })
      .catch(() => {
        setError('Unable to delete a todo');
      })
      .finally(() => {
        removeLoadingId(id);

        inputRef.current?.focus();
      });
  };

  const handleToggle = (todo: Todo) => {
    addLoadingId(todo.id);

    updateTodo(todo.id, {
      completed: !todo.completed,
    })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );
      })
      .catch(() => {
        setError('Unable to update a todo');
      })
      .finally(() => {
        removeLoadingId(todo.id);
      });
  };

  const handleToggleAll = () => {
    const shouldComplete = !allCompleted;

    todos
      .filter(todo => todo.completed !== shouldComplete)
      .forEach(todo => {
        addLoadingId(todo.id);

        updateTodo(todo.id, {
          completed: shouldComplete,
        })
          .then(updatedTodo => {
            setTodos(current =>
              current.map(item => (item.id === todo.id ? updatedTodo : item)),
            );
          })
          .catch(() => {
            setError('Unable to update a todo');
          })
          .finally(() => {
            removeLoadingId(todo.id);
          });
      });
  };

  const clearCompleted = () => {
    Promise.all(
      completedTodos.map(todo => {
        addLoadingId(todo.id);

        return deleteTodo(todo.id)
          .then(() => {
            setTodos(current => current.filter(t => t.id !== todo.id));
          })
          .catch(() => {
            setError('Unable to delete a todo');
          })
          .finally(() => {
            removeLoadingId(todo.id);
          });
      }),
    ).finally(() => {
      inputRef.current?.focus();
    });
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditedTitle(todo.title);
  };

  const saveEditing = (todo: Todo) => {
    if (loadingIds.includes(todo.id)) {
      return;
    }

    const title = editedTitle.trim();

    if (title === todo.title) {
      setEditingId(null);

      return;
    }

    if (!title) {
      addLoadingId(todo.id);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(current => current.filter(item => item.id !== todo.id));

          setEditingId(null);
          inputRef.current?.focus();
        })
        .catch(() => {
          setError('Unable to delete a todo');
        })
        .finally(() => {
          removeLoadingId(todo.id);
        });

      return;
    }

    addLoadingId(todo.id);

    updateTodo(todo.id, {
      title,
    })
      .then(updatedTodo => {
        setTodos(current =>
          current.map(item => (item.id === todo.id ? updatedTodo : item)),
        );

        setEditingId(null);
        inputRef.current?.focus();
      })
      .catch(() => {
        setError('Unable to update a todo');
        // editingId НЕ змінюємо
      })
      .finally(() => {
        removeLoadingId(todo.id);
      });
  };

  const handleEditKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      saveEditing(todo);
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      setEditingId(null);
      setEditedTitle(todo.title);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <form onSubmit={handleSubmit}>
          <div className="todoapp__header">
            {todos.length > 0 && (
              <button
                type="button"
                data-cy="ToggleAllButton"
                className={classNames('todoapp__toggle-all', {
                  active: allCompleted,
                })}
                onClick={handleToggleAll}
              />
            )}
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={query}
              onChange={event => setQuery(event.target.value)}
              disabled={tempTodo !== null}
            />
          </div>
        </form>

        {isLoading && <div data-cy="TodoLoader">Loading...</div>}

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              {visibleTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={classNames('todo', {
                    completed: todo.completed,
                    editing: editingId === todo.id,
                  })}
                >
                  <label
                    className="todo__status-label"
                    htmlFor={`todo-${todo.id}`}
                  >
                    <input
                      id={`todo-${todo.id}`}
                      data-cy="TodoStatus"
                      className="todo__status"
                      type="checkbox"
                      checked={todo.completed}
                      disabled={
                        loadingIds.includes(todo.id) || editingId === todo.id
                      }
                      onChange={() => handleToggle(todo)}
                    />
                  </label>
                  {editingId === todo.id ? (
                    <input
                      ref={editInputRef}
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      value={editedTitle}
                      onChange={event => setEditedTitle(event.target.value)}
                      onBlur={() => saveEditing(todo)}
                      onKeyDown={event => handleEditKeyDown(event, todo)}
                    />
                  ) : (
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => startEditing(todo)}
                    >
                      {todo.title}
                    </span>
                  )}
                  {editingId !== todo.id && (
                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDelete(todo.id)}
                      disabled={loadingIds.includes(todo.id)}
                    >
                      ×
                    </button>
                  )}
                  <div
                    data-cy="TodoLoader"
                    className={classNames('todo__loader', {
                      'is-active': loadingIds.includes(todo.id),
                      hidden: !loadingIds.includes(todo.id),
                    })}
                  >
                    <div className="loader" />
                  </div>
                </div>
              ))}
              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input
                      className="todo__status"
                      type="checkbox"
                      checked={false}
                      readOnly
                    />
                  </label>
                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>
                  <button type="button" className="todo__remove" disabled>
                    ×
                  </button>
                  <div data-cy="TodoLoader" className="todo__loader is-active">
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>
            <footer className="todoapp__footer">
              <span data-cy="TodosCounter">
                {activeTodosCount} {itemsText} left
              </span>
              <nav className="filter" data-cy="Filter">
                <a
                  data-cy="FilterLinkAll"
                  href="#/"
                  className={classNames('filter__link', {
                    selected: filter === Filter.All,
                  })}
                  onClick={() => setFilter(Filter.All)}
                >
                  All
                </a>
                <a
                  data-cy="FilterLinkActive"
                  href="#/active"
                  className={classNames('filter__link', {
                    selected: filter === Filter.Active,
                  })}
                  onClick={() => setFilter(Filter.Active)}
                >
                  Active
                </a>
                <a
                  data-cy="FilterLinkCompleted"
                  href="#/completed"
                  className={classNames('filter__link', {
                    selected: filter === Filter.Completed,
                  })}
                  onClick={() => setFilter(Filter.Completed)}
                >
                  Completed
                </a>
              </nav>
              <button
                data-cy="ClearCompletedButton"
                type="button"
                disabled={!completedTodos.length}
                onClick={clearCompleted}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames('notification', 'is-danger', 'is-light', {
          hidden: !error,
        })}
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
