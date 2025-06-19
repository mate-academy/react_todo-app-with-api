/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import * as postService from './api/todos';
import { FilterParams } from './types/messages';
import { ErrorMessages } from './types/messages';

export const App: React.FC = () => {
  const [data, setData] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [todoInOperation, setTodoInOperation] = useState<number[]>([]);
  const [filter, setFilter] = useState<FilterParams>(FilterParams.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessages>(ErrorMessages.None);
  const previousActiveCountRef = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newTitle, setNewTitle] = useState<string>('');

  const addOperation = (id: number) => {
    setTodoInOperation((prev) => [...prev, id]);
  };

  const removeOperation = (id: number) => {
    setTodoInOperation((prev) => prev.filter((todoId) => todoId !== id));
  };

  useEffect(() => {
    if (todoInOperation.length === 0 && editingId === null) {
      inputRef.current?.focus();
    }
  }, [todoInOperation, editingId]);

  useEffect(() => {
    setErrorMessage(ErrorMessages.None);
    getTodos()
      .then(setData)
      .catch(() => setErrorMessage(ErrorMessages.OnGet));
  }, []);

  useEffect(() => {
    if (errorMessage !== ErrorMessages.None) {
      const timer = setTimeout(() => {
        setErrorMessage(ErrorMessages.None);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const filteredTodos = data.filter((todo) => {
    switch (filter) {
      case FilterParams.Active:
        return !todo.completed;
      case FilterParams.Completed:
        return todo.completed;
      default:
        return true;
    }
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  function handleEditClick(id: number) {
    setEditingId(id);
    setNewTitle(data.find((todo) => todo.id === id)?.title || '');
  }

  function createTodo() {
    if (newTodoTitle.trim() === '') {
      setErrorMessage(ErrorMessages.OnEmptyTitle);
      return;
    }

    const newTodoData = {
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    previousActiveCountRef.current = data.filter((todo) => !todo.completed).length;

    const tempTodo = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle.trim(),
      completed: false,
    };

    addOperation(0);
    setData((currentTodos) => [...currentTodos, tempTodo]);

    postService
      .createTodo(newTodoData)
      .then((newTodo) => {
        setData((currentTodos) => currentTodos.map((todo) => (todo.id === 0 ? newTodo : todo)));
        setNewTodoTitle('');
      })
      .catch(() => {
        setData((currentTodos) => currentTodos.filter((todo) => todo.id !== 0));
        setErrorMessage(ErrorMessages.OnPost);
      })
      .finally(() => {
        removeOperation(0);
        inputRef.current?.focus();
      });
  }

  function deleteCompletedTodos() {
    const completedTodos = data.filter((todo) => todo.completed);
    const completedIds = completedTodos.map((todo) => todo.id);

    // Додаємо всі ID у операції
    completedIds.forEach(addOperation);

    const deletePromises = completedIds.map((id) =>
      postService.deleteTodo(id).then(() => id)
    );

    Promise.allSettled(deletePromises)
      .then((results) => {
        const successIds = results
          .filter((result) => result.status === 'fulfilled')
          .map((result) => result.value as number);

        const isSomeFailed = results.some(
          (result) => result.status === 'rejected'
        );

        if (isSomeFailed) {
          setErrorMessage(ErrorMessages.OnDelete);
        }

        setData((currentTodos) =>
          currentTodos.filter((todo) => !successIds.includes(todo.id))
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnDelete);
      })
      .finally(() => {
        // Видаляємо всі ID з операцій
        completedIds.forEach(removeOperation);
      });
  }

  function deleteTodo(id: number) {
    addOperation(id);

    postService
      .deleteTodo(id)
      .then(() => {
        setData((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnDelete);
      })
      .finally(() => {
        removeOperation(id);
        inputRef.current?.focus();
      });
  }

  function updateTodo(todo: Todo) {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      deleteTodo(todo.id);
      return;
    }

    addOperation(todo.id);

    postService
      .updateTodo(todo)
      .then((updatedTodo: Todo) => {
        setData((currentTodos) =>
          currentTodos.map((existingTodo) =>
            existingTodo.id === updatedTodo.id ? updatedTodo : existingTodo
          )
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessages.OnPatch);
      })
      .finally(() => {
        removeOperation(todo.id);
        inputRef.current?.focus();
      });
  }

  function handleBlurOrKeyDown(e: React.KeyboardEvent<HTMLInputElement>, id: number) {
    const newEditedTitle = e.currentTarget.value.trim();

    if (e.key === 'Enter' || e.type === 'blur') {
      if (newEditedTitle === '') {
        const todo = data.find((todoItem) => todoItem.id === id);

        if (todo) {
          deleteTodo(todo.id);
        }
      } else {
        const todo = data.find((todoItem) => todoItem.id === id);

        if (todo) {
          todo.title = newEditedTitle;
          updateTodo(todo);
        }
      }

      setEditingId(null);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  }

  const handleToggle = (id: number) => {
    addOperation(id);

    const todo = data.find((todo) => todo.id === id);

    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };

      postService.updateTodo(updatedTodo)
        .then((updatedTodo: Todo) => {
          setData((currentTodos) =>
            currentTodos.map((existingTodo) =>
              existingTodo.id === updatedTodo.id ? updatedTodo : existingTodo
            )
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.OnPatch);
        })
        .finally(() => {
          removeOperation(id);
          inputRef.current?.focus();
        });
    }
  };

  const allCompleted = data.every((todo) => todo.completed);

  const toggleAllTodos = () => {
    const shouldBeCompleted = !allCompleted;

    const todosToUpdate = data.filter(todo => todo.completed !== shouldBeCompleted);

    todosToUpdate.forEach(todo => {
      const updatedTodo = { ...todo, completed: shouldBeCompleted };

      addOperation(todo.id);

      postService.updateTodo(updatedTodo)
        .then((updated) => {
          setData(currentTodos =>
            currentTodos.map(current =>
              current.id === updated.id ? updated : current
            )
          );
        })
        .catch(() => {
          setErrorMessage(ErrorMessages.OnPatch);
        })
        .finally(() => {
          removeOperation(todo.id);
        });
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const isEnterKey = e.key === 'Enter';

    if (isEnterKey) {
      e.preventDefault();
      createTodo();
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {data.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: data.every((todo) => todo.completed),
              })}
              data-cy="ToggleAllButton"
              aria-label="Toggle all todos"
              onClick={toggleAllTodos}
              disabled={data.length === 0}
            />
          )}

          <input
            ref={inputRef}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={newTodoTitle}
            onChange={(e) => setNewTodoTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={todoInOperation.length > 0}
          />
        </header>

        {data.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {filteredTodos.map((todo) => (
              <div
                data-cy="Todo"
                className={classNames('todo', {
                  completed: todo.completed,
                })}
                key={todo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                </label>

                <span data-cy="TodoTitle" className="todo__title">
                  {editingId === todo.id ? (
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={(e) => handleBlurOrKeyDown(e, todo.id)}
                      onKeyDown={(e) => handleBlurOrKeyDown(e, todo.id)}
                      autoFocus
                      ref={inputRef}
                    />
                  ) : (
                    <span onDoubleClick={() => handleEditClick(todo.id)}>
                      {todo.title}
                    </span>
                  )}
                </span>

                {editingId !== todo.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => deleteTodo(todo.id)}
                  >
                    ×
                  </button>
                )}

                <div
                  data-cy="TodoLoader"
                  className={classNames('modal overlay', {
                    'is-active': todoInOperation.includes(todo.id),
                  })}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {data.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todoInOperation.length > 0
                ? previousActiveCountRef.current
                : data.filter((todo) => !todo.completed).length}{' '}
              items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === FilterParams.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterParams.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === FilterParams.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterParams.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === FilterParams.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterParams.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={data.filter((todo) => todo.completed).length === 0}
              onClick={deleteCompletedTodos}
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
          { hidden: errorMessage === ErrorMessages.None }
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(ErrorMessages.None)}
          aria-label="Hide error notification"
        />
        {errorMessage}
      </div>
    </div>
  );
};
