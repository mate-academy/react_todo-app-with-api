/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import {
  createTodo,
  deleteTodo,
  getTodos,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

enum FilterBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

const modalBackgroundClass = 'modal-background has-background-white-ter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(FilterBy.All);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');

  const newTodoField = useRef<HTMLInputElement>(null);
  const editTodoField = useRef<HTMLInputElement>(null);

  const focusNewTodoField = () => {
    setTimeout(() => {
      newTodoField.current?.focus();
    }, 0);
  };

  const addProcessingId = (todoId: number) => {
    setProcessingIds(currentIds => [...currentIds, todoId]);
  };

  const removeProcessingId = (todoId: number) => {
    setProcessingIds(currentIds => (
      currentIds.filter(id => id !== todoId)
    ));
  };

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = window.setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => window.clearTimeout(timerId);
  }, [errorMessage]);

  useEffect(() => {
    if (editingTodoId) {
      editTodoField.current?.focus();
    }
  }, [editingTodoId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;

      case FilterBy.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);
  const allTodosCompleted = todos.length > 0 && activeTodos.length === 0;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setErrorMessage('');
    setIsAdding(true);

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    createTodo(title)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        focusNewTodoField();
      });
  };

  const handleDelete = (todoId: number) => {
    setErrorMessage('');
    addProcessingId(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        removeProcessingId(todoId);
        focusNewTodoField();
      });
  };

  const handleToggle = (todo: Todo) => {
    setErrorMessage('');
    addProcessingId(todo.id);

    updateTodo(todo.id, { completed: !todo.completed })
      .then(updatedTodo => {
        setTodos(currentTodos => (
          currentTodos.map(currentTodo => (
            currentTodo.id === todo.id ? updatedTodo : currentTodo
          ))
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        removeProcessingId(todo.id);
      });
  };

  const handleToggleAll = () => {
    const completed = activeTodos.length > 0;
    const todosToUpdate = todos.filter(todo => (
      todo.completed !== completed
    ));

    setErrorMessage('');

    todosToUpdate.forEach(todo => addProcessingId(todo.id));

    Promise.all(
      todosToUpdate.map(todo => (
        updateTodo(todo.id, { completed })
      )),
    )
      .then(updatedTodos => {
        setTodos(currentTodos => (
          currentTodos.map(todo => {
            const updatedTodo = updatedTodos.find(({ id }) => id === todo.id);

            return updatedTodo || todo;
          })
        ));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
      })
      .finally(() => {
        todosToUpdate.forEach(todo => removeProcessingId(todo.id));
      });
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const startEditing = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingTitle('');
  };

  const handleRename = (todo: Todo) => {
    const title = editingTitle.trim();

    if (title === todo.title) {
      cancelEditing();

      return;
    }

    if (!title) {
      addProcessingId(todo.id);

      handleDelete(todo.id).catch(() => {
        setEditingTodoId(todo.id);
        setEditingTitle('');
      });

      return;
    }

    setErrorMessage('');
    addProcessingId(todo.id);

    updateTodo(todo.id, { title })
      .then(updatedTodo => {
        setTodos(currentTodos => (
          currentTodos.map(currentTodo => (
            currentTodo.id === todo.id ? updatedTodo : currentTodo
          ))
        ));

        cancelEditing();
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        editTodoField.current?.focus();
      })
      .finally(() => {
        removeProcessingId(todo.id);
      });
  };

  const handleEditKeyUp = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (event.key === 'Escape') {
      cancelEditing();
    }

    if (event.key === 'Enter') {
      handleRename(todo);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={`todoapp__toggle-all ${
                allTodosCompleted ? 'active' : ''
              }`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => {
              const isProcessing = processingIds.includes(todo.id);
              const isEditing = editingTodoId === todo.id;

              return (
                <div
                  data-cy="Todo"
                  className={todo.completed ? 'todo completed' : 'todo'}
                  key={todo.id}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                      disabled={isProcessing}
                    />
                  </label>

                  {isEditing ? (
                    <form onSubmit={event => event.preventDefault()}>
                      <input
                        ref={editTodoField}
                        data-cy="TodoTitleField"
                        type="text"
                        className="todo__title-field"
                        placeholder="Empty todo will be deleted"
                        value={editingTitle}
                        onChange={event => (
                          setEditingTitle(event.target.value)
                        )}
                        onBlur={() => handleRename(todo)}
                        onKeyUp={event => handleEditKeyUp(event, todo)}
                        disabled={isProcessing}
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
                        disabled={isProcessing}
                      >
                        ×
                      </button>
                    </>
                  )}

                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${
                      isProcessing ? 'is-active' : ''
                    }`}
                  >
                    <div className={modalBackgroundClass} />
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
                    disabled
                  />
                </label>

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
                  <div className={modalBackgroundClass} />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${
                  filterBy === FilterBy.All ? 'selected' : ''
                }`}
                data-cy="FilterLinkAll"
                onClick={() => setFilterBy(FilterBy.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${
                  filterBy === FilterBy.Active ? 'selected' : ''
                }`}
                data-cy="FilterLinkActive"
                onClick={() => setFilterBy(FilterBy.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${
                  filterBy === FilterBy.Completed ? 'selected' : ''
                }`}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilterBy(FilterBy.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodos.length === 0}
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
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
