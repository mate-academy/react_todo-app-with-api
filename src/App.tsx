/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
// import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { client } from './utils/fetchClient';

type TodosError =
  | 'Unable to load todos'
  | 'Title should not be empty'
  | 'Unable to add a todo'
  | 'Unable to delete a todo'
  | 'Unable to update a todo'
  | null;

type Filter = 'all' | 'active' | 'completed';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isEdited, setIsEdited] = useState(0);
  const [error, setErrorMessage] = useState<TodosError>('Unable to load todos');
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoaded, setIsLoaded] = useState<number[] | null>(null);
  const [title, setTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);

  // #region effects
  useEffect(() => {
    getTodos()
      .then(data => {
        setTodosFromServer(data);
        setTodos(data);
      })
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setErrorMessage(null), 3000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);

  useEffect(() => {
    if (isEdited !== 0) {
      editInputRef.current?.focus();
    }
  }, [isEdited]);

  // if (!USER_ID) {
  //   return <UserWarning />;
  // }

  // #endregion

  // #region filter
  const handleFilter = (filterBy: Filter) => {
    setFilter(filterBy);

    switch (filterBy) {
      case 'active':
        setTodos([...todosFromServer].filter(todo => !todo.completed));
        break;

      case 'completed':
        setTodos([...todosFromServer].filter(todo => todo.completed));
        break;

      default:
        setTodos(todosFromServer);
        break;
    }
  };

  useEffect(() => {
    if (filter !== 'all') {
      handleFilter(filter);
    }
  }, [todosFromServer]);

  // #endregion filter

  // #region create
  const handleCreate = async () => {
    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setIsCreating(true);

    const newTodo: Todo = {
      id: -1,
      title: title.trim(),
      completed: false,
      userId: USER_ID,
    };

    setTodos([...todos, newTodo]);

    try {
      const response = await client.post<Todo>('/todos', {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      });

      setTodosFromServer(prev => [
        ...prev,
        {
          id: response.id,
          title: response.title,
          userId: response.userId,
          completed: response.completed,
        },
      ]);

      setTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setTodos([...todos].filter(todo => todo.id !== newTodo.id));
    } finally {
      setIsCreating(false);
      inputRef.current?.focus();
    }
  };

  // #endregion

  // #region delete
  const handleDelete = async (todo: Todo) => {
    setIsLoaded([todo.id]);

    try {
      await client.delete(`/todos/${todo.id}`);
      setIsLoaded(null);
      setTodos([...todos].filter(t => t.id !== todo.id));
      setTodosFromServer([...todosFromServer].filter(t => t.id !== todo.id));
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setIsLoaded(null);
      inputRef.current?.focus();
    }
  };

  // #endregion

  // #region clear
  const handleClear = async () => {
    const result = todosFromServer
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setIsLoaded(result);

    const results = await Promise.allSettled(
      result.map(id => client.delete(`/todos/${id}`)),
    );
    const succesfulIds = results.flatMap((r, i) =>
      r.status === 'fulfilled' ? result[i] : [],
    );

    const hasError = results.some(r => r.status === 'rejected');

    if (succesfulIds.length > 0) {
      setTodos(prev => prev.filter(t => !succesfulIds.includes(t.id)));
      setTodosFromServer(prev =>
        prev.filter(t => !succesfulIds.includes(t.id)),
      );
    }

    if (hasError) {
      setErrorMessage('Unable to delete a todo');
    }

    setIsLoaded(null);
    inputRef.current?.focus();
  };

  // #endregion

  // #region update status
  const handleUpdateStatus = async (todo: Todo) => {
    setIsLoaded([todo.id]);

    const newCompleted = !todo.completed;

    try {
      await client.patch(`/todos/${todo.id}`, { completed: newCompleted });
      setTodos(prev =>
        prev.map(t =>
          t.id === todo.id ? { ...t, completed: newCompleted } : t,
        ),
      );
      setTodosFromServer(prev =>
        prev.map(t =>
          t.id === todo.id ? { ...t, completed: newCompleted } : t,
        ),
      );
    } catch {
      setErrorMessage('Unable to update a todo');
    } finally {
      setIsLoaded(null);
    }
  };

  // #endregion

  // #region update title
  const handleUpdateTitle = async (todo: Todo) => {
    const trimmedTitle = newTitle.trim();

    if (trimmedTitle === todo.title) {
      setIsEdited(0);

      return;
    }

    setIsLoaded([todo.id]);

    if (trimmedTitle.length === 0) {
      try {
        await client.delete(`/todos/${todo.id}`);
        setTodos(prev => prev.filter(t => t.id !== todo.id));
        setTodosFromServer(prev => prev.filter(t => t.id !== todo.id));
        setIsEdited(0);
      } catch {
        setErrorMessage('Unable to delete a todo');
        editInputRef.current?.focus();
      } finally {
        setIsLoaded(null);
      }

      return;
    }

    const oldTitle = todo.title;

    setTodos(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, title: trimmedTitle } : t)),
    );
    setTodosFromServer(prev =>
      prev.map(t => (t.id === todo.id ? { ...t, title: trimmedTitle } : t)),
    );

    try {
      await client.patch(`/todos/${todo.id}`, { title: trimmedTitle });
      setIsEdited(0);
    } catch {
      setTodos(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, title: oldTitle } : t)),
      );
      setTodosFromServer(prev =>
        prev.map(t => (t.id === todo.id ? { ...t, title: oldTitle } : t)),
      );
      setErrorMessage('Unable to update a todo');
      editInputRef.current?.focus();
    } finally {
      setIsLoaded(null);
      if (isEdited === 0) {
        inputRef.current?.focus();
      }
    }
  };

  // #endregion

  // #region toggle all

  const handleToggleAll = async () => {
    const activeTodos = todosFromServer.filter(todo => !todo.completed);

    if (activeTodos.length > 0) {
      setIsLoaded(activeTodos.map(t => t.id));

      try {
        await Promise.all(
          activeTodos.map(todo =>
            client.patch(`/todos/${todo.id}`, { completed: true }),
          ),
        );

        setTodosFromServer(prev =>
          prev.map(todo =>
            !todo.completed ? { ...todo, completed: true } : todo,
          ),
        );
        setTodos(prev =>
          prev.map(todo =>
            !todo.completed ? { ...todo, completed: true } : todo,
          ),
        );
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setIsLoaded(null);
        inputRef.current?.focus();
      }
    } else {
      const ids = todosFromServer.map(t => t.id);

      setIsLoaded(ids);
      try {
        await Promise.all(
          todosFromServer.map(todo =>
            client.patch(`/todos/${todo.id}`, { completed: false }),
          ),
        );

        setTodosFromServer(prev =>
          prev.map(todo => ({ ...todo, completed: false })),
        );
        setTodos(prev => prev.map(todo => ({ ...todo, completed: false })));
      } catch {
        setErrorMessage('Unable to update a todo');
      } finally {
        setIsLoaded(null);
        inputRef.current?.focus();
      }
    }
  };

  // #endregion

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosFromServer.length > 0 && (
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

          <form
            onSubmit={e => {
              e.preventDefault();
              handleCreate();
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={isCreating}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {todos &&
            todos.map(todo => (
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
                    onClick={() => handleUpdateStatus(todo)}
                  />
                </label>
                {isEdited === todo.id ? (
                  <form
                    onSubmit={async e => {
                      e.preventDefault();
                      await handleUpdateTitle(todo);
                    }}
                    onBlur={async () => {
                      await handleUpdateTitle(todo);
                    }}
                  >
                    <input
                      ref={editInputRef}
                      data-cy="TodoTitleField"
                      type="text"
                      className="todo__title-field"
                      placeholder="Empty todo will be deleted"
                      value={newTitle}
                      onChange={e => setNewTitle(e.target.value)}
                      onKeyUp={e => {
                        if (e.key === 'Escape') {
                          setIsEdited(0);
                        }
                      }}
                    />
                  </form>
                ) : (
                  <>
                    <span
                      data-cy="TodoTitle"
                      className="todo__title"
                      onDoubleClick={() => {
                        setIsEdited(todo.id);
                        setNewTitle(todo.title);
                        setTimeout(() => editInputRef.current?.focus(), 0);
                      }}
                    >
                      {todo.title}
                    </span>

                    <button
                      type="button"
                      className="todo__remove"
                      data-cy="TodoDelete"
                      onClick={() => handleDelete(todo)}
                    >
                      ×
                    </button>
                  </>
                )}

                <div
                  data-cy="TodoLoader"
                  className={
                    isLoaded?.includes(todo.id) ||
                    (isCreating && todo.id === todos[todos.length - 1].id)
                      ? 'modal overlay is-active'
                      : 'modal overlay'
                  }
                >
                  <div className="modal-background has-background-white-ter" />
                  <div className="loader" />
                </div>
              </div>
            ))}
        </section>

        {todosFromServer.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {[...todosFromServer].filter(todo => !todo.completed).length === 1
                ? '1 item'
                : `${[...todosFromServer].filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  filter === 'all' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => handleFilter('all')}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  filter === 'active' ? 'filter__link selected' : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => handleFilter('active')}
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
                onClick={() => handleFilter('completed')}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={[...todos].filter(t => t.completed).length === 0}
              onClick={handleClear}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={
          error === null
            ? 'notification is-danger is-light has-text-weight-normal hidden'
            : 'notification is-danger is-light has-text-weight-normal'
        }
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {error === 'Unable to load todos' && 'Unable to load todos'}
        {error === 'Title should not be empty' && 'Title should not be empty'}
        {error === 'Unable to add a todo' && 'Unable to add a todo'}
        {error === 'Unable to delete a todo' && 'Unable to delete a todo'}
        {error === 'Unable to update a todo' && 'Unable to update a todo'}
      </div>
    </div>
  );
};
