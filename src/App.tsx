import React, { useRef } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { getTodos, addTodo, deleteTodo, updateTodo } from './api/todos';
import { useEffect, useState } from 'react';
import { getFilterTodos } from './helpers';
import cn from 'classnames';

enum FILTERS {
  all = 'all',
  completed = 'completed',
  active = 'active',
}

enum ERROR {
  LOAD__ERROR = 'Unable to add a todo',
  LOAD__DELETE = 'Unable to delete a todo',
  LOAD__UPDATE = 'Unable to update a todo',
  LOAD__TITLE = 'Title should not be empty',
}

export const App: React.FC = () => {
  const [todo, setTodo] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState('all');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [edit, setEdit] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const LOAD_ERROR = {
    LOAD_TODOS: 'Unable to load todos',
  };

  const autoFocus = useRef<HTMLInputElement>(null);

  const handleUpdate = (currentTodo: Todo) => {
    setLoadingIds(prev => [...prev, currentTodo.id]);
    updateTodo({ ...currentTodo, completed: !currentTodo.completed })
      .then(() =>
        setTodo(prev =>
          prev.map(todos =>
            todos.id === currentTodo.id
              ? { ...todos, completed: !todos.completed }
              : todos,
          ),
        ),
      )
      .catch(() => setError(ERROR.LOAD__UPDATE))
      .finally(() => {
        setLoadingIds(prev => prev.filter(ids => ids !== currentTodo.id));
        autoFocus.current?.focus();
      });
  };

  const handleDelete = (id: number) => {
    setLoadingIds(prev => [...prev, id]);
    deleteTodo(id)
      .then(() => setTodo(prev => prev.filter(todos => todos.id !== id)))
      .catch(() => setError(ERROR.LOAD__DELETE))
      .finally(() => {
        setLoadingIds(prev => prev.filter(ids => ids !== id));
        autoFocus.current?.focus();
      });
  };

  const clearCompleted = () => {
    todo
      .filter(todos => todos.completed)
      .forEach(todos => handleDelete(todos.id));
  };

  const handleUpdateTodo = () => {
    const completeUpdateAll = todo.every(todos => todos.completed);
    const updateAllTodo = todo.filter(
      todos => todos.completed === completeUpdateAll,
    );

    updateAllTodo.forEach(todos => handleUpdate(todos));
  };

  const handleRename = (currentTodo: Todo) => {
    if (editTitle.trim() === currentTodo.title) {
      setEdit(null);

      return;
    }

    if (!editTitle.trim()) {
      handleDelete(currentTodo.id);

      return;
    }

    setLoadingIds(prev => [...prev, currentTodo.id]);
    updateTodo({ ...currentTodo, title: editTitle.trim() })
      .then(() => {
        setTodo(prev =>
          prev.map(todos =>
            todos.id === currentTodo.id
              ? { ...todos, title: editTitle.trim() }
              : todos,
          ),
        );
        setEdit(null);
      })
      .catch(() => setError(ERROR.LOAD__UPDATE))
      .finally(() =>
        setLoadingIds(prev => prev.filter(ids => ids !== currentTodo.id)),
      );
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) {
      setError(ERROR.LOAD__TITLE);

      return;
    }

    setLoading(true);
    setTempTodo({
      id: 0,
      userId: USER_ID,
      completed: false,
      title: title.trim(),
    });

    addTodo({
      userId: USER_ID,
      completed: false,
      title: title.trim(),
    })
      .then(newTodo => {
        setTodo(prev => [...prev, newTodo]);
        setTitle('');
      })

      .catch(() => setError(ERROR.LOAD__ERROR))
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
        setTimeout(() => {
          autoFocus.current?.focus();
        }, 0);
      });
  };

  useEffect(() => {
    autoFocus.current?.focus();
  }, []);

  useEffect(() => {
    getTodos()
      .then(data => setTodo(data))
      .catch(() => setError(LOAD_ERROR.LOAD_TODOS));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError('');
      }, 3000);
    }
  }, [error]);

  const filterTodos = getFilterTodos(todo, selected);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todo.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todo.every(todos => todos.completed),
              })}
              data-cy="ToggleAllButton"
              onClick={handleUpdateTodo}
            />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              disabled={loading}
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={autoFocus}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>
        {todo.length > 0 && (
          <section className={cn('todoapp__main')} data-cy="TodoList">
            {filterTodos.map((todos: Todo) => (
              <div
                data-cy="Todo"
                className={`todo ${todos.completed ? 'completed' : ''}`}
                key={todos.id}
              >
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label
                  className="todo__status-label"
                  htmlFor={`todo-${todos.id}`}
                >
                  <input
                    id={`todo-${todos.id}`}
                    data-cy="TodoStatus"
                    type="checkbox"
                    className="todo__status"
                    checked={todos.completed}
                    onChange={() => handleUpdate(todos)}
                  />
                </label>
                {edit === todos.id ? (
                  <input
                    value={editTitle}
                    onChange={event => setEditTitle(event.target.value)}
                    onKeyUp={event => {
                      if (event.key === 'Escape') {
                        setEdit(null);
                      }

                      if (event.key === 'Enter') {
                        handleRename(todos);
                      }
                    }}
                    onBlur={() => handleRename(todos)}
                    data-cy="TodoTitleField"
                    type="text"
                    className="todo__title-field"
                    autoFocus
                  />
                ) : (
                  <span
                    data-cy="TodoTitle"
                    className="todo__title"
                    onDoubleClick={() => {
                      setEdit(todos.id);
                      setEditTitle(todos.title);
                    }}
                  >
                    {todos.title}
                  </span>
                )}
                {edit !== todos.id && (
                  <button
                    type="button"
                    className="todo__remove"
                    data-cy="TodoDelete"
                    onClick={() => handleDelete(todos.id)}
                  >
                    ×
                  </button>
                )}

                {/* overlay will cover the todo while it is being deleted or updated */}
                <div
                  data-cy="TodoLoader"
                  className={`modal overlay ${loadingIds.includes(todos.id) ? 'is-active' : ''}`}
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
          </section>
        )}

        {tempTodo && (
          <div data-cy="Todo" className="todo">
            <input
              id="temp-todo"
              type="checkbox"
              className="todo__status"
              readOnly
            />

            <span data-cy="TodoTitle" className="todo__title">
              {tempTodo.title}
            </span>
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        )}

        {todo.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todo.filter(todos => !todos.completed).length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: selected === FILTERS.all,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setSelected(FILTERS.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: selected === FILTERS.active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setSelected(FILTERS.active)}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: selected === FILTERS.completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setSelected(FILTERS.completed)}
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={clearCompleted}
              disabled={!todo.some(todos => todos.completed)}
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
        className={`notification is-danger is-light has-text-weight-normal ${error ? '' : 'hidden'}`}
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
