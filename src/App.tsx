import React, {
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import {
  USER_ID,
  addTodo,
  deleteTodo,
  getTodos,
  updateTodo,
} from './api/todos';
import { Todo } from './types/Todo';
import { FILTERS, FilterType } from './constants/filters';
import { NewTodo } from './components/NewTodo';
import { TodoList } from './components/TodoList';
import { Filter } from './components/Filter';

type DeleteResult = {
  id: number;
  success: boolean;
};

type UpdateResult = {
  id: number;
  todo?: Todo;
  success: boolean;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [filter, setFilter] = useState<FilterType>(FILTERS.all);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Any todo with an in-flight request (add/delete/toggle/rename).
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const [errorMessage, setErrorMessage] = useState('');
  const [errorHidden, setErrorHidden] = useState(true);

  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const newTodoField = useRef<HTMLInputElement>(null);

  /*
   * Show error notification.
   */
  const showError = useCallback((message: string): void => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    setErrorMessage(message);
    setErrorHidden(false);

    errorTimerRef.current = setTimeout(() => {
      setErrorHidden(true);
      setErrorMessage('');
    }, 3000);
  }, []);

  /*
   * Hide error notification.
   */
  const hideError = useCallback((): void => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }

    setErrorHidden(true);
    setErrorMessage('');
  }, []);

  const markProcessing = (ids: number[]): void => {
    setProcessingIds(current => [
      ...current,
      ...ids.filter(id => !current.includes(id)),
    ]);
  };

  const unmarkProcessing = (ids: number[]): void => {
    setProcessingIds(current => current.filter(id => !ids.includes(id)));
  };

  /*
   * Focus the input after adding is finished.
   */
  useEffect(() => {
    if (!isAdding) {
      newTodoField.current?.focus();
    }
  }, [isAdding]);

  /*
   * Load todos when the application starts.
   */
  useEffect(() => {
    const loadTodos = async (): Promise<void> => {
      hideError();

      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        showError('Unable to load todos');
      }
    };

    loadTodos();

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, [hideError, showError]);

  /*
   * Keep the filter in sync with the URL hash.
   */
  useEffect(() => {
    const applyFilterFromHash = (): void => {
      const hash = window.location.hash.replace(/^#\/?/, '');

      if (hash === FILTERS.active || hash === FILTERS.completed) {
        setFilter(hash);
      } else {
        setFilter(FILTERS.all);
      }
    };

    applyFilterFromHash();
    window.addEventListener('hashchange', applyFilterFromHash);

    return () => {
      window.removeEventListener('hashchange', applyFilterFromHash);
    };
  }, []);

  /*
   * Re-focus the input once the last pending operation has finished.
   */
  const previousProcessingCount = useRef(0);

  useEffect(() => {
    const currentCount = processingIds.length;

    if (previousProcessingCount.current > 0 && currentCount === 0) {
      newTodoField.current?.focus();
    }

    previousProcessingCount.current = currentCount;
  }, [processingIds.length]);

  /*
   * Add a new todo.
   */
  const handleAddTodo = async (
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    hideError();

    setIsAdding(true);

    const newTempTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const createdTodo = await addTodo(trimmedTitle);

      setTodos(currentTodos => [...currentTodos, createdTodo]);

      setTitle('');
    } catch {
      showError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsAdding(false);
    }
  };

  /*
   * Delete one todo.
   */
  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    hideError();
    markProcessing([todoId]);

    try {
      await deleteTodo(todoId);
      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));
    } catch (error) {
      showError('Unable to delete a todo');
      throw error;
    } finally {
      unmarkProcessing([todoId]);
    }
  };

  /*
   * Toggle a single todo.
   */
  const handleToggleTodo = async (todo: Todo): Promise<void> => {
    hideError();

    markProcessing([todo.id]);

    try {
      const updated = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch {
      showError('Unable to update a todo');
    } finally {
      unmarkProcessing([todo.id]);
    }
  };

  /*
   * Toggle every todo. Only changed todos get a PATCH request.
   */
  const handleToggleAll = async (): Promise<void> => {
    const allCompleted = todos.length > 0 && todos.every(t => t.completed);
    const targetStatus = !allCompleted;

    const todosToUpdate = todos.filter(t => t.completed !== targetStatus);

    if (todosToUpdate.length === 0) {
      return;
    }

    hideError();

    const idsToUpdate = todosToUpdate.map(t => t.id);

    markProcessing(idsToUpdate);

    const results: UpdateResult[] = await Promise.all(
      todosToUpdate.map(async (todo): Promise<UpdateResult> => {
        try {
          const updated = await updateTodo(todo.id, {
            completed: targetStatus,
          });

          return { id: todo.id, todo: updated, success: true };
        } catch {
          return { id: todo.id, success: false };
        }
      }),
    );

    const successfulUpdates = results
      .filter((r): r is UpdateResult & { todo: Todo } => r.success && !!r.todo)
      .map(r => r.todo);

    const hasErrors = results.some(r => !r.success);

    if (successfulUpdates.length > 0) {
      setTodos(currentTodos =>
        currentTodos.map(t => {
          const updated = successfulUpdates.find(u => u.id === t.id);

          return updated ?? t;
        }),
      );
    }

    unmarkProcessing(idsToUpdate);

    if (hasErrors) {
      showError('Unable to update a todo');
    }
  };

  /*
   * Rename a todo.
   */
  const handleRenameTodo = async (
    todo: Todo,
    newTitle: string,
  ): Promise<void> => {
    hideError();
    markProcessing([todo.id]);

    try {
      const updated = await updateTodo(todo.id, { title: newTitle });
      setTodos(currentTodos =>
        currentTodos.map(t => (t.id === updated.id ? updated : t)),
      );
    } catch (error) {
      showError('Unable to update a todo');
      throw error;
    } finally {
      unmarkProcessing([todo.id]);
    }
  };

  const handleClearCompleted = async (): Promise<void> => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id)
      .filter(id => !processingIds.includes(id));

    if (completedIds.length === 0) {
      return;
    }

    hideError();

    markProcessing(completedIds);

    const results: DeleteResult[] = await Promise.all(
      completedIds.map(async (id): Promise<DeleteResult> => {
        try {
          await deleteTodo(id);

          return { id, success: true };
        } catch {
          return { id, success: false };
        }
      }),
    );

    const successfulIds = results
      .filter(result => result.success)
      .map(result => result.id);

    const hasErrors = results.some(result => !result.success);

    if (successfulIds.length > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !successfulIds.includes(todo.id)),
      );
    }

    unmarkProcessing(completedIds);

    if (hasErrors) {
      showError('Unable to delete a todo');
    }
  };

  /*
   * Filter todos.
   */
  const visibleTodos = todos.filter(todo => {
    if (filter === FILTERS.active) {
      return !todo.completed;
    }

    if (filter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const completedTodosCount = todos.filter(todo => todo.completed).length;

  const todosCounterText = `${activeTodosCount} ${
    activeTodosCount === 1 ? 'item' : 'items'
  } left`;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: isAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={handleToggleAll}
            />
          )}

          <NewTodo
            title={title}
            onTitleChange={setTitle}
            onSubmit={handleAddTodo}
            isAdding={isAdding}
            inputRef={newTodoField}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onRename={handleRenameTodo}
          />
        )}

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounterText}
            </span>

            <Filter filter={filter} onFilterChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={completedTodosCount === 0}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: errorHidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {errorMessage}
      </div>
    </div>
  );
};
