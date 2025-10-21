//* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  setTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

enum Filter {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

enum ErrorMessage {
  EmptyTitle = 'Title should not be empty',
  LoadTodos = 'Unable to load todos',
  AddTodo = 'Unable to add a todo',
  DeleteTodo = 'Unable to delete a todo',
  UpdateTodo = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const editInputRef = useRef<HTMLInputElement | null>(null);

  const resetEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  useEffect(() => {
    setIsInitialLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LoadTodos);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsInitialLoading(false);
      });
  }, []);

  useEffect(() => {
    if (editingTodoId !== null) {
      editInputRef.current?.focus();
      editInputRef.current?.select();
    }
  }, [editingTodoId]);

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

  const handleAddTodo = () => {
    if (title.trim() === '') {
      setErrorMessage(ErrorMessage.EmptyTitle);

      setTimeout(() => {
        setErrorMessage('');
      }, 3000);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsLoading(true);
    setErrorMessage('');

    setTodo(title.trim())
      .then((realTodo: Todo) => {
        setTodos(prev => [...prev, realTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodo);

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false);
        setTempTodo(null);
      });
  };

  const handleDeleteTodo = (id: number) => {
    setDeletingTodoIds(prev => (prev.includes(id) ? prev : [...prev, id]));

    deleteTodo(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));

        if (editingTodoId === id) {
          resetEditing();
        }

        inputRef.current?.focus();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setDeletingTodoIds(prev => prev.filter(activeId => activeId !== id));
      });
  };

  const handleUpdateTodo = (id: number, completed: boolean) => {
    setUpdatingTodoIds(prev => [...prev, id]);

    updateTodo(id, { completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === id ? updatedTodo : todo)),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodo);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setUpdatingTodoIds(prev => prev.filter(activeId => activeId !== id));
      });
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = !todos.every(todo => todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const idsToUpdate = todosToUpdate.map(todo => todo.id);

    setUpdatingTodoIds(prev => [
      ...prev,
      ...idsToUpdate.filter(id => !prev.includes(id)),
    ]);

    Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: shouldCompleteAll }),
      ),
    )
      .then(results => {
        const successfulUpdates: Todo[] = [];

        results.forEach(result => {
          if (result.status === 'fulfilled') {
            successfulUpdates.push(result.value);
          }
        });

        if (successfulUpdates.length > 0) {
          setTodos(prev =>
            prev.map(todo => {
              const updated = successfulUpdates.find(u => u.id === todo.id);

              return updated ?? todo;
            }),
          );
        }

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage(ErrorMessage.UpdateTodo);
          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .finally(() => {
        setUpdatingTodoIds(prev =>
          prev.filter(id => !idsToUpdate.includes(id)),
        );
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setIsLoading(true);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const successfulIds = completedTodos
          .filter((_, i) => results[i].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(prev => prev.filter(todo => !successfulIds.includes(todo.id)));

        const hasErrors = results.some(r => r.status === 'rejected');

        if (hasErrors) {
          setErrorMessage(ErrorMessage.DeleteTodo);

          setTimeout(() => setErrorMessage(''), 3000);
        }
      })
      .finally(() => {
        setIsLoading(false);

        inputRef.current?.focus();
      });
  };

  const handleStartEditing = (todo: Todo) => {
    if (
      deletingTodoIds.includes(todo.id) ||
      updatingTodoIds.includes(todo.id)
    ) {
      return;
    }

    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const finishEditing = () => {
    if (editingTodoId === null) {
      return;
    }

    const currentTodo = todos.find(todo => todo.id === editingTodoId);

    if (!currentTodo) {
      resetEditing();

      return;
    }

    const trimmedTitle = editingTitle.trim();

    setEditingTitle(trimmedTitle);

    if (trimmedTitle === '') {
      handleDeleteTodo(currentTodo.id);

      return;
    }

    if (trimmedTitle === currentTodo.title) {
      resetEditing();

      return;
    }

    const targetId = currentTodo.id;

    setUpdatingTodoIds(prev => [...prev, targetId]);

    updateTodo(targetId, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(todo => (todo.id === targetId ? updatedTodo : todo)),
        );
        resetEditing();
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UpdateTodo);
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setUpdatingTodoIds(prev =>
          prev.filter(activeId => activeId !== targetId),
        );
      });
  };

  const handleEditKeyUp = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      resetEditing();
    }
  };

  const handleEditSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    finishEditing();
  };

  const handleEditBlur = () => {
    finishEditing();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!isInitialLoading && todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${
                todos.every(todo => todo.completed) ? 'active' : ''
              }`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <input
            key={isLoading ? 'loading' : 'ready'}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            autoFocus
            ref={inputRef}
            value={title}
            onChange={e => setTitle(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                handleAddTodo();
              }
            }}
            disabled={isLoading}
          />
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {visibleTodos.map(todo => {
            const statusId = `todo-status-${todo.id}`;

            return (
              <div
                key={todo.id}
                data-cy="Todo"
                className={todo.completed ? 'todo completed' : 'todo'}
              >
                <div className="todo__status-wrapper">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    id={statusId}
                    checked={todo.completed}
                    disabled={updatingTodoIds.includes(todo.id)}
                    onChange={event =>
                      handleUpdateTodo(todo.id, event.target.checked)
                    }
                  />

                  <label className="todo__status-label" htmlFor={statusId}>
                    <span className="visually-hidden">
                      {todo.completed
                        ? 'Mark todo as active'
                        : 'Mark todo as completed'}
                    </span>
                  </label>
                </div>

                {editingTodoId === todo.id ? (
                  <form className="todo__form" onSubmit={handleEditSubmit}>
                    <input
                      ref={editInputRef}
                      className="todo__title-field"
                      data-cy="TodoTitleField"
                      value={editingTitle}
                      onChange={event => setEditingTitle(event.target.value)}
                      onBlur={handleEditBlur}
                      onKeyUp={handleEditKeyUp}
                      disabled={
                        updatingTodoIds.includes(todo.id) ||
                        deletingTodoIds.includes(todo.id)
                      }
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => handleStartEditing(todo)}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDeleteTodo(todo.id)}
                      disabled={deletingTodoIds.includes(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${
                    deletingTodoIds.includes(todo.id) ||
                    updatingTodoIds.includes(todo.id)
                      ? 'is-active'
                      : ''
                  }`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            );
          })}

          {tempTodo && isLoading && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={tempTodo.completed ? 'todo completed' : 'todo'}
            >
              <div className="todo__status-wrapper">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  id="todo-status-temp"
                  checked={tempTodo.completed}
                  readOnly
                />

                <label
                  className="todo__status-label"
                  htmlFor="todo-status-temp"
                >
                  <span className="visually-hidden">
                    {tempTodo.completed
                      ? 'Mark todo as active'
                      : 'Mark todo as completed'}
                  </span>
                </label>
              </div>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                disabled
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

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todos.filter(todo => !todo.completed).length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === Filter.All ? 'selected' : ''}`}
                onClick={() => setFilter(Filter.All)}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === Filter.Active ? 'selected' : ''}`}
                onClick={() => setFilter(Filter.Active)}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === Filter.Completed ? 'selected' : ''}`}
                onClick={() => setFilter(Filter.Completed)}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={todos.every(todo => !todo.completed) || isLoading}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${!errorMessage ? 'hidden' : ''}`}
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
