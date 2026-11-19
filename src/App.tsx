/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { Todo } from './types/Todo';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { UserWarning } from './UserWarning';

const modalBackgroundClass = 'modal-background has-background-white-ter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState('all');
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editingLockRef = useRef(false);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        setErrorMessage('Unable to load todos');
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
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const activeTodos = todos.filter(todo => !todo.completed);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isAdding) {
      return;
    }

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

    setErrorMessage('');
    setTempTodo(temporaryTodo);
    setIsAdding(true);

    try {
      const newTodo = await addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, newTodo]);
      setTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  const handleDelete = async (todoId: number) => {
    if (processingIds.includes(todoId)) {
      return;
    }

    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage('Unable to delete a todo');

      return false;
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));

      inputRef.current?.focus();
    }
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(
      todo => todo.completed && !processingIds.includes(todo.id),
    );

    await Promise.allSettled(completedTodos.map(todo => handleDelete(todo.id)));
  };

  const handleToggle = async (todo: Todo, newStatus: boolean) => {
    if (processingIds.includes(todo.id)) {
      return;
    }

    if (todo.completed === newStatus) {
      return;
    }

    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: newStatus,
      });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const newStatus = !allCompleted;

    const todosToUpdate = todos.filter(
      todo => todo.completed !== newStatus && !processingIds.includes(todo.id),
    );

    await Promise.allSettled(
      todosToUpdate.map(todo => handleToggle(todo, newStatus)),
    );
  };

  const startEditing = (todo: Todo) => {
    if (processingIds.includes(todo.id)) {
      return;
    }

    editingLockRef.current = false;
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    editingLockRef.current = true;
    setEditingId(null);
    setEditTitle('');
  };

  const saveEditing = async (todo: Todo) => {
    if (editingLockRef.current) {
      return;
    }

    editingLockRef.current = true;

    const newTitle = editTitle.trim();

    if (newTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (!newTitle) {
      const deleted = await handleDelete(todo.id);

      if (deleted) {
        cancelEditing();
      } else {
        editingLockRef.current = false;
      }

      return;
    }

    if (processingIds.includes(todo.id)) {
      return;
    }

    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todo.id]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: newTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
      setEditingId(null);
      setEditTitle('');
    } catch {
      setErrorMessage('Unable to update a todo');
      editingLockRef.current = false;
    } finally {
      setProcessingIds(currentIds => currentIds.filter(id => id !== todo.id));
    }
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
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
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
              disabled={isAdding}
              autoFocus
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
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
                    onChange={() => handleToggle(todo, !todo.completed)}
                    disabled={processingIds.includes(todo.id)}
                  />
                </label>

                {editingId === todo.id ? (
                  <form
                    onSubmit={event => {
                      event.preventDefault();
                      saveEditing(todo);
                    }}
                  >
                    <input
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      value={editTitle}
                      onChange={event => setEditTitle(event.target.value)}
                      onBlur={() => saveEditing(todo)}
                      onKeyUp={event => {
                        if (event.key === 'Escape') {
                          cancelEditing();
                        }
                      }}
                      autoFocus
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
                      disabled={processingIds.includes(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}
                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${
                    processingIds.includes(todo.id) ? 'is-active' : ''
                  }`}
                >
                  <div className={modalBackgroundClass} />
                  <div className="loader" />
                </div>
              </div>
            ))}

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
              {`${activeTodos.length} ${
                activeTodos.length === 1 ? 'item' : 'items'
              } left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  filter === 'all' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  filter === 'active' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  filter === 'completed'
                    ? 'filter__link selected'
                    : 'filter__link'
                }
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
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}
      </div>
    </div>
  );
};
