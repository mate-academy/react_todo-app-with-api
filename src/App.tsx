/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';

enum Status {
  active = 'active',
  completed = 'completed',
  all = 'all',
}

enum Message {
  load = 'Unable to load todos',
  title = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
  null = '',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [queryStatus, setQueryStatus] = useState(Status.all);
  const [errorMessage, setErrorMessage] = useState(Message.null);
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [disabledInput, setDisabledInput] = useState(false);
  const [deleting, setDeleting] = useState<number[]>([]);
  const [updating, setUpdating] = useState<number[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);
  const [updatedTitle, setUpdatedTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const closeErrorMessage = () => {
    setHasError(false);

    setTimeout(() => {
      setErrorMessage(Message.null);
    }, 500);
  };

  const handleErrorMessage = (message: Message, error = true) => {
    setHasError(error);
    setErrorMessage(message);

    setTimeout(() => {
      closeErrorMessage();
    }, 3000);
  };

  const handleFocusOnInput = (ref: React.RefObject<HTMLInputElement>) => {
    setTimeout(() => {
      if (ref.current) {
        ref.current.focus();
      }
    }, 0);
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
  };

  const visiableTodos = (query = queryStatus) => {
    return todos?.filter(todo => {
      switch (query) {
        case Status.completed:
          return todo.completed;

        case Status.active:
          return !todo.completed;

        case Status.all:
          return todo;
      }
    });
  };

  const addTodo = () => {
    const newTodo: Omit<Todo, 'id'> = {
      userId: 789,
      title: inputValue.trim(),
      completed: false,
    };

    setDisabledInput(true);
    setTempTodo({ id: 0, ...newTodo });

    todoService
      .addTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        handleInputChange('');
      })
      .catch(() => handleErrorMessage(Message.add))
      .finally(() => {
        setTempTodo(null);
        setDisabledInput(false);

        handleFocusOnInput(inputRef);
      });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!inputValue.trim()) {
      handleErrorMessage(Message.title);

      return;
    }

    addTodo();
  };

  const deleteTodo = (id: number) => {
    setDeleting(currentArr => [...currentArr, id]);

    todoService
      .deleteTodo(id)
      .then(() => {
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
        setSelectedTodo(null);
      })
      .catch(() => {
        handleErrorMessage(Message.delete);
      })
      .finally(() => {
        setDeleting([]);
        handleFocusOnInput(inputRef);
      });
  };

  const handleUpdateTodo = (updatedTodo: Todo) => {
    setUpdating(currentArr => [...currentArr, updatedTodo.id]);

    todoService
      .updateTodo(updatedTodo)
      .then(todoFromServer => {
        const { id } = todoFromServer;

        setTodos(currentTodos =>
          currentTodos.map(todo => (todo.id === id ? todoFromServer : todo)),
        );
        setSelectedTodo(null);
      })
      .catch(() => handleErrorMessage(Message.update))
      .finally(() => {
        setUpdating([]);
      });
  };

  const toggleAll = () => {
    if (
      visiableTodos(Status.completed).length === todos.length ||
      visiableTodos(Status.active).length === todos.length
    ) {
      visiableTodos(Status.all).forEach(todo =>
        handleUpdateTodo({ ...todo, completed: !todo.completed }),
      );
    } else {
      visiableTodos(Status.active).forEach(todo =>
        handleUpdateTodo({ ...todo, completed: true }),
      );
    }
  };

  const handleDoubleClick = (todo: Todo) => {
    setSelectedTodo(todo);
    setUpdatedTitle(todo.title);
  };

  const updateTodoTitle = (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedTodo) {
      const trimmedTitle = updatedTitle.trim();

      if (trimmedTitle === '') {
        deleteTodo(selectedTodo.id);

        return;
      }

      if (trimmedTitle === selectedTodo.title) {
        setSelectedTodo(null);

        return;
      }

      const updatedTodo: Todo = { ...selectedTodo, title: trimmedTitle };

      handleUpdateTodo(updatedTodo);
    }
  };

  const handleEscapeKey = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && selectedTodo) {
      setSelectedTodo(null);
    }
  };

  useEffect(() => {
    handleFocusOnInput(inputRef);

    setLoading(true);

    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => handleErrorMessage(Message.load))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">Todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: visiableTodos(Status.completed).length === todos.length,
              })}
              data-cy="ToggleAllButton"
              onClick={toggleAll}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={e => handleInputChange(e.target.value)}
              disabled={disabledInput}
            />
          </form>
        </header>
        {!loading && (
          <section className="todoapp__main" data-cy="TodoList">
            {visiableTodos().map(todo => {
              const { id, title, completed } = todo;

              return (
                <div
                  data-cy="Todo"
                  className={classNames('todo', { completed: completed })}
                  key={id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={completed}
                      onChange={() =>
                        handleUpdateTodo({
                          ...todo,
                          completed: !todo.completed,
                        })
                      }
                    />
                  </label>

                  {selectedTodo?.id === id ? (
                    <form onSubmit={updateTodoTitle}>
                      <input
                        autoFocus
                        data-cy="TodoTitleField"
                        type="text"
                        className="todoapp__new-todo todoapp__new-todo--update"
                        placeholder="Empty todo will be deleted"
                        value={updatedTitle}
                        onChange={e => setUpdatedTitle(e.target.value)}
                        onBlur={updateTodoTitle}
                        onKeyUp={handleEscapeKey}
                      />
                    </form>
                  ) : (
                    <>
                      <span
                        data-cy="TodoTitle"
                        className="todo__title"
                        onDoubleClick={() => handleDoubleClick(todo)}
                      >
                        {title}
                      </span>
                      <button
                        type="button"
                        className="todo__remove"
                        data-cy="TodoDelete"
                        onClick={() => deleteTodo(id)}
                      >
                        x
                      </button>
                    </>
                  )}

                  {/* 'is-active' class puts this modal on top of the todo */}
                  <div
                    data-cy="TodoLoader"
                    className={classNames('modal overlay', {
                      'is-active':
                        deleting.includes(id) || updating.includes(id),
                    })}
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

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
              />
            </label>

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <button type="button" className="todo__remove" data-cy="TodoDelete">
              x
            </button>

            {/* 'is-active' class puts this modal on top of the todo */}
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div
                className="modal-background
                    has-background-white-ter"
              />
              <div className="loader" />
            </div>
          </div>
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {visiableTodos(Status.active).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: queryStatus === Status.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setQueryStatus(Status.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: queryStatus === Status.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setQueryStatus(Status.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: queryStatus === Status.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setQueryStatus(Status.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={visiableTodos(Status.completed).length < 1}
              onClick={() => {
                visiableTodos(Status.completed).forEach(todo =>
                  deleteTodo(todo.id),
                );
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          // eslint-disable-next-line prettier/prettier
          { hidden: !hasError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeErrorMessage}
        />
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
