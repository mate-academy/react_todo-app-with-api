/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState, useRef } from 'react';
import { UserWarning } from './UserWarning';
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [title, setTitle] = useState<string>('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState<string>('');

  const activeCount = todos.filter(todo => !todo.completed).length;
  const hasCompleted = todos.filter(todo => todo.completed).length > 0;

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = todos.filter(todo => {
    if (filter === 'active') {
      return !todo.completed;
    }

    if (filter === 'completed') {
      return todo.completed;
    }

    return true;
  });

  useEffect(() => {
    inputRef.current?.focus();
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTodos();

        setTodos(data);
      } catch {
        setError('Unable to load todos');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title should not be empty');

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const newTodo = {
        userId: USER_ID,
        title: title.trim(),
        completed: false,
      };

      const createdTodo = await addTodo(newTodo);

      setTodos(prev => [...prev, createdTodo]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  async function handleDelete(id: number) {
    try {
      setLoading(true);
      setError(null);

      await deleteTodo(id);

      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(id: number, completed: boolean) {
    try {
      setLoading(true);
      setError(null);

      const update = await toggleTodo(id, !completed);

      setTodos(prev => prev.map(todo => (todo.id === id ? update : todo)));
    } catch {
      setError('Unable to toggle a todo');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdate(todo: Todo) {
    const trimmed = editingTitle.trim();

    if (!trimmed) {
      await handleDelete(todo.id);
      setEditingId(null);

      return;
    }

    try {
      setLoading(true);
      setError(null);

      const updated = await updateTodo(todo.id, { title: trimmed });

      setTodos(prev => prev.map(t => (t.id === todo.id ? updated : t)));
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoading(false);
      setEditingId(null);
    }
  }

  function startEditing(todo: Todo) {
    setEditingId(todo.id);
    setEditingTitle(todo.title);
  }

  function cancelEditing() {
    setEditingId(null);
    setEditingTitle('');
  }

  async function handleClearCompleted() {
    try {
      setLoading(true);
      setError(null);

      for (const todo of todos) {
        if (todo.completed) {
          await deleteTodo(todo.id);
        }
      }

      setTodos(prev => prev.filter(todo => !todo.completed));
    } catch {
      setError('Unable to delete a todo');
    } finally {
      setLoading(false);
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleAdd}>
            <input
              ref={inputRef}
              disabled={loading}
              data-cy="NewTodoField"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        {loading && <p></p>}
        {error && <p>{error}</p>}
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={`todo ${todo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                  onChange={() => handleToggle(todo.id, todo.completed)}
                />
              </label>
              {editingId === todo.id ? (
                <form
                  onSubmit={e => {
                    e.preventDefault();
                    handleUpdate(todo);
                  }}
                >
                  <input
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={() => handleUpdate(todo)}
                    onKeyDown={e => {
                      if (e.key === 'Escape') {
                        cancelEditing();
                      }
                    }}
                    autoFocus
                  />
                </form>
              ) : (
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => startEditing(todo)}
                >
                  {todo.title}
                </span>
              )}
              {/* Remove button appears only on hover */}
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDelete(todo.id)}
              >
                ×
              </button>

              {/* overlay will cover the todo while it is being deleted or updated */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
        </section>

        {/* Hide the footer if there are no todos */}

        {todos.length <= 0 && !error && <p>There are no todos</p>}
        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeCount} items left`}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={`filter__link ${filter === 'all' ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
                onClick={() => setFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={`filter__link ${filter === 'active' ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
                onClick={() => setFilter('active')}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={`filter__link ${filter === 'completed' ? 'selected' : ''}`}
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
              disabled={!hasCompleted}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />

        {error}
      </div>
    </div>
  );
};
