/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos,
  USER_ID,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';

const FILTER_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const App: React.FC = () => {
  //#region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodos, setTempTodos] = useState<Todo | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>(FILTER_STATUS.ALL);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const [isError, setIsError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  //#endregion States

  //#region useEffect
  /**
   * Effect hook for loading todos from the API on component mount.
   */
  useEffect(() => {
    let ignore = false;
    /**
     * Loads todos from the API and updates the component state.
     * Handles loading, success, and error states.
     */

    const loadTodos = async () => {
      setIsLoading(true);

      try {
        const dataTodos = await getTodos();

        if (!ignore) {
          setTodos(dataTodos);
          setIsError(null);
          setTempTodos(null);
        }
      } catch {
        if (ignore) {
          return;
        }

        setIsError('Unable to load todos');
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    };

    loadTodos();

    return () => {
      ignore = true;
    };
  }, []);

  /**
   * Effect hook to manage the display duration of error messages.
   * Clears the error message after 3 seconds.
   */
  useEffect(() => {
    if (!isError) {
      return;
    }

    const timerErrorId = setTimeout(() => setIsError(null), 3000);

    return () => {
      clearTimeout(timerErrorId);
    };
  }, [isError]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * Effect hook to focus the new todo input field whenever the todos array changes.
   */
  useEffect(() => {
    const timerId = setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => {
      clearTimeout(timerId);
    };
  }, [isLoading, todos.length]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash === '#/active') {
        setActiveFilter(FILTER_STATUS.ACTIVE);
      } else if (hash === '#/completed') {
        setActiveFilter(FILTER_STATUS.COMPLETED);
      } else {
        setActiveFilter(FILTER_STATUS.ALL);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [activeFilter]);

  //#endregion useEffect

  if (!USER_ID) {
    return <UserWarning />;
  }

  //#region ----------------functions-----------------
  /**
   * Filters the list of todos based on the provided filter type.
   * @param {string} filter_type - The type of filter to apply ('all', 'active', 'completed').
   * @returns {Todo[]} An array of todos filtered according to the specified type.
   */
  const getFilteredTodos = (filter_type: string) => {
    switch (filter_type) {
      case FILTER_STATUS.ACTIVE:
        return todos.filter(todo => !todo.completed);
      case FILTER_STATUS.COMPLETED:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  /**
   * Handles the submission of the add todo form.
   * Creates a new todo, adds it to the list, and handles loading and error states.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */

  const handeleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimedQuery = query.trim();

    if (!trimedQuery) {
      setIsError('Title should not be empty');
      setQuery('');

      return;
    }

    setIsError(null);
    setIsLoading(true);

    const tempTodo = {
      id: 0,
      title: trimedQuery,
      userId: USER_ID,
      completed: false,
    };

    setTempTodos(tempTodo);

    try {
      const newTodo = await createTodo(trimedQuery);

      setTodos(prev => [...prev, newTodo]);
      setQuery('');
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setTempTodos(null);
      setIsLoading(false);
    }
  };

  /**
   * Handles clearing all completed todos.
   */
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosId = completedTodos.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...completedTodosId]);

    try {
      await Promise.all(
        completedTodos.map(async todo => {
          try {
            await deleteTodo(todo.id);
            setTodos(prev => prev.filter(t => t.id !== todo.id));
          } catch {
            throw new Error('Failed to delete');
          }
        }),
      );
      //setTodos(prev => prev.filter(todo => !todo.completed));
    } catch {
      setIsError('Unable to delete a todo');
    } finally {
      setProcessingIds(prev =>
        prev.filter(id => !completedTodosId.includes(id)),
      );
      inputRef.current?.focus();
    }
  };

  /**
   * Handles deleting a specific todo by its ID.
   * @param {number} todoId - The ID of the todo to delete.
   */
  const handleDeleteTodo = async (todoId: number) => {
    setProcessingIds(prev => [...prev, todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(todo => todo.id !== todoId));
    } catch (error) {
      setIsError('Unable to delete a todo');
      throw error;
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const handleToggleSingle = async (todo: Todo) => {
    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const newTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });

      setTodos(prev => prev.map(t => (t.id === newTodo.id ? newTodo : t)));
    } catch {
      setIsError('Unable to update a todo');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== todo.id));
    }
  };

  const handleToggleAll = async () => {
    const hasActiveTodo = todos.some(todo => !todo.completed);
    const todosUpdate = todos.filter(todo => todo.completed !== hasActiveTodo);
    const idsTodoUpdate = todosUpdate.map(todo => todo.id);

    setProcessingIds(prev => [...prev, ...idsTodoUpdate]);

    try {
      await Promise.all(
        todosUpdate.map(async todo => {
          const newTodo = await updateTodo(todo.id, {
            ...todo,
            completed: hasActiveTodo,
          });

          setTodos(prev => prev.map(t => (t.id === newTodo.id ? newTodo : t)));
        }),
      );
    } catch {
      setIsError('Unable to update a todo');
    } finally {
      setProcessingIds(prev => prev.filter(id => !idsTodoUpdate.includes(id)));
    }
  };

  const handleEditingTodo = async (todo: Todo, text: string) => {
    const trimedText = text.trim();

    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const editedTodo = await updateTodo(todo.id, {
        ...todo,
        title: trimedText,
      });

      setTodos(prev =>
        prev.map(t => (editedTodo.id === t.id ? editedTodo : t)),
      );
      setEditingTodoId(null);
    } catch {
      setIsError('Unable to update a todo');
    } finally {
      setProcessingIds(prev => prev.filter(id => todo.id !== id));
    }
  };

  const handleSubmit = async (todo: Todo) => {
    const trimmed = editingTitle.trim();

    if (!trimmed) {
      try {
        await handleDeleteTodo(todo.id);
      } catch {
        //setIsError('Unable to delete a todo');
      }

      return;
    }

    if (todo.title !== editingTitle) {
      await handleEditingTodo(todo, trimmed);
    } else {
      setEditingTodoId(null);
    }
  };

  //#endregion functions
  const isAllTodosCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);
  const hasCompletedTodos = todos.some(todo => todo.completed);

  const counActiveTodos = todos.filter(todo => !todo.completed).length;
  const visibleTodos = getFilteredTodos(activeFilter);

  const Header = (
    <header className="todoapp__header">
      {todos.length !== 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', {
            active: isAllTodosCompleted,
          })}
          data-cy="ToggleAllButton"
          onClick={() => handleToggleAll()}
        />
      )}

      {/* Add a todo on form submit */}
      <form onSubmit={handeleAddTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={inputRef}
          value={query}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={e => setQuery(e.target.value)}
          disabled={isLoading}
        />
      </form>
    </header>
  );

  const TodoList = (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        const isProcessing = processingIds.includes(todo.id);

        return (
          <div
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
            key={todo.id}
          >
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() => handleToggleSingle(todo)}
              />
            </label>

            {editingTodoId !== todo.id ? (
              <span
                data-cy="TodoTitle"
                className="todo__title"
                onDoubleClick={e => {
                  e.preventDefault();
                  setEditingTodoId(todo.id);
                  setEditingTitle(todo.title);
                }}
              >
                {todo.title}
              </span>
            ) : (
              <input
                className="todo__title-field"
                data-cy="TodoTitleField"
                type="text"
                value={editingTitle}
                onChange={e => setEditingTitle(e.target.value)}
                autoFocus
                placeholder={!editingTitle ? 'Empty todo will be delete' : ''}
                onBlur={() => handleSubmit(todo)}
                onKeyUp={e => {
                  if (e.key === 'Enter') {
                    handleSubmit(todo);
                  }

                  if (e.key === 'Escape') {
                    setEditingTodoId(null);
                  }
                }}
              />
            )}

            {editingTodoId !== todo.id && (
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            )}

            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', { 'is-active': isProcessing })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}

      {tempTodos && (
        <div
          data-cy="Todo"
          className={cn('todo', { completed: tempTodos.completed })}
          key={tempTodos.id}
        >
          <label className="todo__status-label">
            <input
              data-cy="TodoStatus"
              type="checkbox"
              className="todo__status"
              checked={tempTodos.completed}
            />
          </label>

          <span data-cy="TodoTitle" className="todo__title">
            {tempTodos.title}
          </span>

          <button type="button" className="todo__remove" data-cy="TodoDelete">
            ×
          </button>

          <div data-cy="TodoLoader" className="modal overlay is-active">
            <div className="modal-background has-background-white-ter" />
            <div className="loader" />
          </div>
        </div>
      )}
    </section>
  );

  //#region rendering
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {Header}
        {TodoList}

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${counActiveTodos} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: activeFilter === FILTER_STATUS.ALL,
                })}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: activeFilter === FILTER_STATUS.ACTIVE,
                })}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: activeFilter === FILTER_STATUS.COMPLETED,
                })}
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
              disabled={!hasCompletedTodos}
              onClick={() => handleClearCompleted()}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setIsError(null)}
        />
        {isError}
      </div>
    </div>
  );
  //#endregion rendering
};
