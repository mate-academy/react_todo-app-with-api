/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  useEffect(() => {
    if (!isSubmitting) {
      newTodoField.current?.focus();
    }
  }, [isSubmitting]);

  const visibleTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    } else if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const completedTodos = todos.filter(todo => todo.completed);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === '') {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      userId: USER_ID,
      id: 0,
      title: trimmedTitle,
      completed: false,
    });
    addTodo(trimmedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setIsSubmitting(false);
        setTempTodo(null);
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prevIds => [...prevIds, id]);

    return deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));

        return true;
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);

        return false;
      })
      .finally(() => {
        setLoadingIds(prevIds => prevIds.filter(todoId => todoId !== id));
        newTodoField.current?.focus();
      });
  };

  const handleToggleTodo = (todo: Todo) => {
    setLoadingIds(current => [...current, todo.id]);
    updateTodo({ ...todo, completed: !todo.completed })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todo.id));
      });
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every(todo => todo.completed);
    const newStatus = !allCompleted;
    const todosToUpdate = todos.filter(todo => todo.completed !== newStatus);

    todosToUpdate.forEach(todo => handleToggleTodo(todo));
  };

  const handleClearCompleted = () => {
    completedTodos.forEach(todo => handleDelete(todo.id));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditTitle('');
  };

  const saveEditing = (todo: Todo) => {
    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (trimmedTitle === '') {
      handleDelete(todo.id).then(success => {
        if (success) {
          cancelEditing();
        }
      });

      return;
    }

    setLoadingIds(current => [...current, todo.id]);
    updateTodo({ ...todo, title: trimmedTitle })
      .then(updated => {
        setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)));
        cancelEditing();
      })
      .catch(() => {
        setErrorMessage('Unable to update a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      })
      .finally(() => {
        setLoadingIds(current => current.filter(id => id !== todo.id));
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          {todos.length > 0 && (
            <button
              type="button"
              className={
                todos.every(todo => todo.completed)
                  ? 'todoapp__toggle-all active'
                  : 'todoapp__toggle-all'
              }
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}
          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              ref={newTodoField}
              value={newTitle}
              onChange={event => setNewTitle(event.target.value)}
              disabled={isSubmitting}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {todos.length > 0 && (
          <section className="todoapp__main" data-cy="TodoList">
            {visibleTodos.map(todo => (
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
                    onChange={() => handleToggleTodo(todo)}
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
                      autoFocus
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={editTitle}
                      onChange={event => setEditTitle(event.target.value)}
                      onBlur={() => saveEditing(todo)}
                      onKeyUp={event => {
                        if (event.key === 'Escape') {
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
                      onClick={() => handleDelete(todo.id)}
                    >
                      ×
                    </button>
                  </>
                )}
                <div
                  data-cy="TodoLoader"
                  className={
                    loadingIds.includes(todo.id)
                      ? 'modal overlay is-active'
                      : 'modal overlay'
                  }
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
            {tempTodo && (
              <div
                data-cy="Todo"
                className={tempTodo.completed ? 'todo completed' : 'todo'}
                key={tempTodo.id}
              >
                <label className="todo__status-label">
                  <input
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={tempTodo.completed}
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

                <div data-cy="TodoLoader" className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            )}
          </section>
        )}
        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                onClick={() => setFilter('all')}
                href="#/"
                className={
                  filter === 'all' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                onClick={() => setFilter('active')}
                href="#/active"
                className={
                  filter === 'active' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                onClick={() => setFilter('completed')}
                href="#/completed"
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

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodos.length === 0}
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
        {/* show only one message at a time */}
        {errorMessage}
      </div>
    </div>
  );
};
