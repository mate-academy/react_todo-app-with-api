/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setLoadingAction('load');
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(() => setLoadingAction(null));
  }, []);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, tempTodo]);

  useEffect(() => {
    if (editingId !== null) {
      editInputRef.current?.focus();
    }
  }, [editingId]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);
    setLoadingAction('add');
    // Não limpar o campo antes da resposta

    client
      .post<Todo>('/todos', {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        // Não sobrescrever o campo, deixa o usuário decidir
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingAction(null);
        inputRef.current?.focus();
      });
  };

  const handleDeleteTodo = (id: number) => {
    setLoadingAction(`delete-${id}`);
    client
      .delete(`/todos/${id}`)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        if (editingId === id) {
          setEditingId(null);
        }
      })
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() => setLoadingAction(null));
  };

  const handleToggleCompleted = (id: number) => {
    setLoadingAction(`toggle-${id}`);
    const foundTodo = todos.find(t => t.id === id);

    if (!foundTodo) {
      return;
    }

    client
      .patch<Todo>(`/todos/${id}`, { completed: !foundTodo.completed })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t =>
            t.id === id ? { ...t, completed: updatedTodo.completed } : t,
          ),
        );
      })
      .catch(() => setErrorMessage('Unable to update todo'))
      .finally(() => setLoadingAction(null));
  };

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditingTitle('');
  };

  const saveEditing = (id: number) => {
    const trimmedTitle = editingTitle.trim();
    const todo = todos.find(t => t.id === id);

    if (!todo) {
      return;
    }

    if (trimmedTitle === todo.title) {
      cancelEditing();

      return;
    }

    if (!trimmedTitle) {
      handleDeleteTodo(id);

      return;
    }

    setLoadingAction(`edit-${id}`);
    client
      .patch<Todo>(`/todos/${id}`, { title: trimmedTitle })
      .then(updatedTodo => {
        setTodos(prev =>
          prev.map(t =>
            t.id === id ? { ...t, title: updatedTodo.title } : t,
          ),
        );
        cancelEditing();
      })
      .catch(() => setErrorMessage('Unable to update todo'))
      .finally(() => setLoadingAction(null));
  };

  const handleKeyUp = (e: React.KeyboardEvent, id: number) => {
    if (e.key === 'Escape') {
      cancelEditing();
    } else if (e.key === 'Enter') {
      saveEditing(id);
    }
  };

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const hasCompletedTodos = todos.some(todo => todo.completed);
  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  const clearCompleted = () => {
    setLoadingAction('clear');
    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo => client.delete(`/todos/${todo.id}`)),
    )
      .then(() => {
        setTodos(prev => prev.filter(todo => !todo.completed));
      })
      .catch(() => setErrorMessage('Unable to clear completed todos'))
      .finally(() => setLoadingAction(null));
  };

  const handleToggleAll = () => {
    const shouldCompleteAll = !allCompleted;
    const todosToUpdate = shouldCompleteAll
      ? todos.filter(todo => !todo.completed)
      : todos;

    if (todosToUpdate.length === 0) {
      return;
    }

    setLoadingAction('toggle-all');
    Promise.all(
      todosToUpdate.map(todo =>
        client.patch(`/todos/${todo.id}`, { completed: shouldCompleteAll }),
      ),
    )
      .then(() => {
        setTodos(prev =>
          prev.map(todo => ({
            ...todo,
            completed: shouldCompleteAll,
          })),
        );
      })
      .catch(() => setErrorMessage('Unable to toggle all todos'))
      .finally(() => setLoadingAction(null));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
            onClick={handleToggleAll}
            disabled={loadingAction === 'toggle-all'}
            aria-label="Toggle all todos"
          />

          <form onSubmit={handleAddTodo}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={loadingAction === 'add' || loadingAction === 'load'}
              aria-label="New todo title"
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <ul className="todo-list">
            {getFilteredTodos().map(todo => (
              <li
                key={todo.id}
                data-cy="Todo"
                className={`todo ${todo.completed ? 'completed' : ''}`}
              >
                {editingId === todo.id ? (
                  <form
                    onSubmit={e => {
                      e.preventDefault();
                      if (
                        loadingAction?.startsWith('edit-') ||
                        loadingAction === `delete-${todo.id}` ||
                        loadingAction === `toggle-${todo.id}`
                      ) {
                        return;
                      }

                      saveEditing(todo.id);
                    }}
                  >
                    <input
                      ref={editInputRef}
                      type="text"
                      className="todo__title-field"
                      value={editingTitle}
                      onChange={e => setEditingTitle(e.target.value)}
                      onBlur={() => {
                        if (
                          !loadingAction?.startsWith('edit-') &&
                          loadingAction !== `delete-${todo.id}` &&
                          loadingAction !== `toggle-${todo.id}`
                        ) {
                          saveEditing(todo.id);
                        }
                      }}
                      onKeyUp={e => handleKeyUp(e, todo.id)}
                      autoFocus
                      aria-label="Edit todo title"
                      disabled={
                        loadingAction?.startsWith('edit-') ||
                        loadingAction === `delete-${todo.id}` ||
                        loadingAction === `toggle-${todo.id}`
                      }
                    />
                  </form>
                ) : (
                  <>
                    <label
                      className="todo__status-label"
                      htmlFor={`todo-checkbox-${todo.id}`}
                    >
                      <input
                        id={`todo-checkbox-${todo.id}`}
                        type="checkbox"
                        className="todo__status"
                        checked={todo.completed}
                        onChange={() => handleToggleCompleted(todo.id)}
                        disabled={loadingAction === `toggle-${todo.id}`}
                      />
                    </label>
                    <span
                      className="todo__title"
                      onDoubleClick={() => {
                        if (
                          editingId === null &&
                          loadingAction === null
                        ) {
                          startEditing(todo);
                        }
                      }}
                    >
                      {todo.title}
                    </span>
                    {loadingAction === `toggle-${todo.id}` && (
                      <div className="modal overlay is-active">
                        <div
                          className="modal-background has-background-white-ter"
                        />
                        <div className="loader" />
                      </div>
                    )}
                  </>
                )}

                {editingId !== todo.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    onClick={() => handleDeleteTodo(todo.id)}
                    disabled={
                      loadingAction === `delete-${todo.id}` ||
                      editingId === todo.id
                    }
                    aria-label={`Delete ${todo.title}`}
                  >
                    ×
                  </button>
                )}
              </li>
            ))}

            {tempTodo && (
              <li data-cy="Todo" className="todo">
                <span className="todo__title">{tempTodo.title}</span>
                <div className="modal overlay is-active">
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </li>
            )}
          </ul>
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">{activeTodosCount} items left</span>

            <nav className="filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                onClick={() => setFilter('all')}
              >
                All
              </a>
              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                onClick={() => setFilter('active')}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
                onClick={() => setFilter('completed')}
              >
                Completed
              </a>
            </nav>

            {hasCompletedTodos && (
              <button
                type="button"
                className="todoapp__clear-completed"
                onClick={clearCompleted}
                aria-label="Clear completed todos"
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      {errorMessage && (
        <div
          className="notification is-danger is-light has-text-weight-normal"
          role="alert"
          data-cy="ErrorNotification"
        >
          <button
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
            aria-label="Close error message"
          />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
