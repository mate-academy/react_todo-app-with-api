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
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';

const FILTER_STATUS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
} as const;

export const App: React.FC = () => {
  //#region States
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
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
          setTempTodo(null);
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

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setIsError('Title should not be empty');
      setQuery('');

      return;
    }

    setIsError(null);
    setIsLoading(true);

    const emptyTodo = {
      id: 0,
      title: trimmedQuery,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(emptyTodo);

    try {
      const newTodo = await createTodo(trimmedQuery);

      setTodos(prev => [...prev, newTodo]);
      setQuery('');
    } catch {
      setIsError('Unable to add a todo');
    } finally {
      setTempTodo(null);
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
    const trimmedText = text.trim();

    setProcessingIds(prev => [...prev, todo.id]);

    try {
      const editedTodo = await updateTodo(todo.id, {
        ...todo,
        title: trimmedText,
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
      } catch {}

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
  const todosLength = todos.length;

  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const visibleTodos = getFilteredTodos(activeFilter);

  //#region rendering
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todosLength={todosLength}
          isAllTodosCompleted={isAllTodosCompleted}
          onToggleAll={handleToggleAll}
          onAddTodo={handleAddTodo}
          inputRef={inputRef}
          query={query}
          setQuery={setQuery}
          isLoading={isLoading}
        />
        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          processingIds={processingIds}
          editingTodoId={editingTodoId}
          editingTitle={editingTitle}
          onDeleteTodo={handleDeleteTodo}
          onEditingTodoIdChange={setEditingTodoId}
          onEditingTitleChange={setEditingTitle}
          onToggleSingle={handleToggleSingle}
          onSubmit={handleSubmit}
          isError={isError}
        />

        {todos.length !== 0 && (
          <Footer
            countActiveTodos={countActiveTodos}
            activeFilter={activeFilter}
            hasCompletedTodos={hasCompletedTodos}
            onClearCompleted={handleClearCompleted}
            filterStatus={FILTER_STATUS}
          />
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
