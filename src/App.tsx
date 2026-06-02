/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */

import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import {
  USER_ID,
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { Todo } from './types/Todo';

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setError('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Unable to load todos');
      });
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

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const clearError = () => setError('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    clearError();

    const trimmedTitle = title.trim();

if (!trimmedTitle) {
  setError('Title should not be empty');

  return;
}

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setIsAdding(true);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos(current => [...current, createdTodo]);
      setTitle('');
    } catch {
      setError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

const handleDelete = async (todoId: number) => {
  clearError();

  setLoadingIds(ids => [...ids, todoId]);

  try {
    await deleteTodo(todoId);

    setTodos(current =>
      current.filter(todo => todo.id !== todoId),
    );

    return true;
  } catch {
    setError('Unable to delete a todo');

    return false;
  } finally {
    setLoadingIds(ids =>
      ids.filter(id => id !== todoId),
    );

    inputRef.current?.focus();
  }
};

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    await Promise.all(
      completedTodos.map(async todo => {
        try {
          await deleteTodo(todo.id);

          setTodos(current => current.filter(item => item.id !== todo.id));
        } catch {
          setError('Unable to delete a todo');
        }
      }),
    );

    inputRef.current?.focus();
  };

  const handleToggle = async (todo: Todo) => {
    setLoadingIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        completed: !todo.completed,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const shouldComplete = todos.some(todo => !todo.completed);

    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldComplete,
    );

    setLoadingIds(todosToUpdate.map(todo => todo.id));

    try {
      const updatedTodos = await Promise.all(
        todosToUpdate.map(todo =>
          updateTodo({
            ...todo,
            completed: shouldComplete,
          }),
        ),
      );

      setTodos(current =>
        current.map(todo => {
          const updated = updatedTodos.find(item => item.id === todo.id);

          return updated || todo;
        }),
      );
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds([]);
    }
  };

  const handleRename = async (todo: Todo) => {
    const trimmedTitle = editedTitle.trim();

    if (trimmedTitle === todo.title) {
      setEditingId(null);

      return;
    }

if (!trimmedTitle) {
  const deleted = await handleDelete(todo.id);

  if (deleted) {
    setEditingId(null);
  }

  return;
}

    setLoadingIds(ids => [...ids, todo.id]);

    try {
      const updatedTodo = await updateTodo({
        ...todo,
        title: trimmedTitle,
      });

      setTodos(current =>
        current.map(item => (item.id === todo.id ? updatedTodo : item)),
      );

      setEditingId(null);
    } catch {
      setError('Unable to update a todo');
    } finally {
      setLoadingIds(ids => ids.filter(id => id !== todo.id));
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
    data-cy="ToggleAllButton"
    className={`todoapp__toggle-all ${
      todos.every(todo => todo.completed)
        ? 'active'
        : ''
    }`}
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
              disabled={isAdding}
              onChange={event => setTitle(event.target.value)}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {visibleTodos.map(todo => (
                <div
                  key={todo.id}
                  data-cy="Todo"
                  className={[
                    'todo',
                    todo.completed ? 'completed' : '',
                    editingId === todo.id ? 'editing' : '',
                  ].join(' ')}
                >
                  <label className="todo__status-label">
                    <input
                      data-cy="TodoStatus"
                      type="checkbox"
                      className="todo__status"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo)}
                    />
                  </label>

                  {editingId === todo.id ? (
                    <form
                      onSubmit={event => {
                        event.preventDefault();
                        void handleRename(todo);
                      }}
                    >
                      <input
                        data-cy="TodoTitleField"
                        className="todo__title-field"
                        value={editedTitle}
                        autoFocus
                        onChange={e => setEditedTitle(e.target.value)}
                        onBlur={() => handleRename(todo)}
                        onKeyUp={e => {
                          if (e.key === 'Escape') {
                            setEditedTitle(todo.title);
                            setEditingId(null);
                          }
                        }}
                      />
                    </form>
                  ) : (
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setEditingId(todo.id);
                        setEditedTitle(todo.title);
                      }}
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
                    >
                      ×
                    </button>
                  )}
                  <div
                    data-cy="TodoLoader"
                    className={`modal overlay ${
                      loadingIds.includes(todo.id) ? 'is-active' : ''
                    }`}
                  >
                    <div
                      className="modal-background
                      has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              ))}

              {tempTodo && (
                <div data-cy="Todo" className="todo">
                  <label className="todo__status-label">
                    <input type="checkbox" className="todo__status" />
                  </label>

                  <span data-cy="TodoTitle" className="todo__title">
                    {tempTodo.title}
                  </span>

                  <div data-cy="TodoLoader" className="modal overlay is-active">
                    <div
                      className="modal-background
                      has-background-white-ter"
                    />
                    <div className="loader" />
                  </div>
                </div>
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {activeTodosCount} items left
              </span>

              <nav className="filter" data-cy="Filter">
                <a
                  href="#/"
                  data-cy="FilterLinkAll"
                  className={`filter__link ${
                    filter === 'all' ? 'selected' : ''
                  }`}
                  onClick={() => setFilter('all')}
                >
                  All
                </a>

                <a
                  href="#/active"
                  data-cy="FilterLinkActive"
                  className={`filter__link ${
                    filter === 'active' ? 'selected' : ''
                  }`}
                  onClick={() => setFilter('active')}
                >
                  Active
                </a>

                <a
                  href="#/completed"
                  data-cy="FilterLinkCompleted"
                  className={`filter__link ${
                    filter === 'completed' ? 'selected' : ''
                  }`}
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </a>
              </nav>

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                disabled={!todos.some(todo => todo.completed)}
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
        className={`notification is-danger is-light has-text-weight-normal ${
          error ? '' : 'hidden'
        }`}
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
