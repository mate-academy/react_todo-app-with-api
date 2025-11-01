/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo, Filter, ErrorType, FilterType } from './types/Todo';
import {
  getTodos,
  USER_ID,
  createTodo,
  deleteTodo,
  updateTodo,
} from './api/todos';

import { TodoItem } from './TodoItem';
import { NewTodoForm } from './NewTodoForm';
import { ToggleAllButton } from './ToggleAllButton';
import { Footer } from './Footer';
import { ErrorNotification } from './ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [filter, setFilter] = useState<Filter>(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  const showError = useCallback((message: string) => {
    setError(message);
    setTimeout(() => {
      setError('');
    }, 3000);
  }, []);

  const clearError = useCallback(() => {
    setError('');
  }, [setError]);

  const handleFilterChange = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
  }, []);

  useEffect(() => {
    if (!USER_ID) {
      return;
    }

    const loadTodos = async () => {
      try {
        const data = await getTodos();

        setTodos(data);
      } catch (e) {
        showError(ErrorType.LoadTodos);
      } finally {
        setLoading(false);

        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      }
    };

    loadTodos();
  }, [showError]);
  useEffect(() => {
    if (!loading && newTodoFieldRef.current) {
      newTodoFieldRef.current.focus();
    }
  }, [loading]);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      switch (filter) {
        case FilterType.Active:
          return !todo.completed;
        case FilterType.Completed:
          return todo.completed;
        case FilterType.All:
        default:
          return true;
      }
    });
  }, [todos, filter]);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );
  const hasCompletedTodos = useMemo(
    () => todos.some(t => t.completed),
    [todos],
  );
  const isAllCompleted = useMemo(
    () => todos.length > 0 && todos.every(todo => todo.completed),
    [todos],
  );
  const shouldShowList = todos.length > 0 || tempTodo !== null;

  const handleUpdateTodo = useCallback(
    async (
      todo: Todo,
      data: Partial<Todo>,
      errorMessage: ErrorType,
    ): Promise<Todo | null> => {
      clearError();
      setProcessingTodos(prev => [...prev, todo.id]);

      try {
        const updatedTodo = await updateTodo(todo.id, data);

        setTodos(prevTodos =>
          prevTodos.map(t => (t.id === updatedTodo.id ? updatedTodo : t)),
        );

        return updatedTodo;
      } catch (e) {
        showError(errorMessage);

        return null;
      } finally {
        setProcessingTodos(prev => prev.filter(id => id !== todo.id));
      }
    },
    [showError, clearError],
  );

  const handleToggleAll = useCallback(async () => {
    clearError();
    const newStatus = !isAllCompleted;

    const todosToChange = todos.filter(todo => todo.completed !== newStatus);

    if (todosToChange.length === 0) {
      return;
    }

    setProcessingTodos(prev => [...prev, ...todosToChange.map(t => t.id)]);

    const updatePromises = todosToChange.map(todo =>
      updateTodo(todo.id, { completed: newStatus })
        .then(res => ({ id: res.id, success: true, todo: res }))
        .catch(() => ({ id: todo.id, success: false })),
    );

    const results = await Promise.allSettled(updatePromises);

    const successfulUpdates = results
      .filter(
        updateResult =>
          updateResult.status === 'fulfilled' && updateResult.value.success,
      )
      .map(
        updateResult =>
          (
            updateResult as PromiseFulfilledResult<{
              id: number;
              success: boolean;
              todo: Todo;
            }>
          ).value.todo,
      );

    const failedUpdateIds = results
      .filter(
        updateResult =>
          updateResult.status === 'fulfilled' && !updateResult.value.success,
      )
      .map(
        updateResult =>
          (
            updateResult as PromiseFulfilledResult<{
              id: number;
              success: boolean;
            }>
          ).value.id,
      );

    if (successfulUpdates.length < todosToChange.length) {
      showError(ErrorType.UpdateTodo);
    }

    setTodos(prevTodos =>
      prevTodos.map(todo => {
        const updated = successfulUpdates.find(u => u.id === todo.id);

        return updated ? updated : todo;
      }),
    );

    setProcessingTodos(prev =>
      prev.filter(
        id =>
          !todosToChange.map(t => t.id).includes(id) ||
          failedUpdateIds.includes(id),
      ),
    );

    setTimeout(() => {
      newTodoFieldRef.current?.focus();
    }, 0);
  }, [isAllCompleted, todos, showError, clearError]);

  const handleAddTodo = useCallback(
    async (title: string) => {
      clearError();
      const trimmedTitle = title.trim();

      if (trimmedTitle === '') {
        showError(ErrorType.TitleEmpty);

        return false;
      }

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });
      setProcessingTodos(prev => [...prev, 0]);

      try {
        const newTodo = await createTodo(trimmedTitle);

        setTodos(prevTodos => [...prevTodos, newTodo]);

        return true;
      } catch (e) {
        showError(ErrorType.AddTodo);

        return false;
      } finally {
        setTempTodo(null);
        setProcessingTodos(prev => prev.filter(id => id !== 0));
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      }
    },
    [showError, clearError],
  );

  const handleDeleteTodo = useCallback(
    async (
      todoId: number,
      errorMessage: ErrorType = ErrorType.DeleteTodo,
    ): Promise<boolean> => {
      clearError();
      setProcessingTodos(prev => [...prev, todoId]);

      try {
        await deleteTodo(todoId);
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));

        return true;
      } catch (e) {
        showError(errorMessage);

        return false;
      } finally {
        setProcessingTodos(prev => prev.filter(id => id !== todoId));
        setTimeout(() => {
          newTodoFieldRef.current?.focus();
        }, 0);
      }
    },
    [showError, clearError, newTodoFieldRef],
  );

  const handleStatusChange = useCallback(
    (todo: Todo) => {
      handleUpdateTodo(
        todo,
        { completed: !todo.completed },
        ErrorType.UpdateTodo,
      );
    },
    [handleUpdateTodo],
  );

  const handleRenameTodo = useCallback(
    async (todo: Todo, newTitle: string): Promise<boolean> => {
      const trimmedTitle = newTitle.trim();

      if (trimmedTitle === todo.title) {
        return true;
      }

      if (trimmedTitle === '') {
        return handleDeleteTodo(todo.id, ErrorType.DeleteTodo);
      }

      const updatedTodo = await handleUpdateTodo(
        todo,
        { title: trimmedTitle },
        ErrorType.UpdateTodo,
      );

      return updatedTodo !== null;
    },
    [handleUpdateTodo, handleDeleteTodo],
  );

  const handleClearCompleted = useCallback(async () => {
    clearError();
    const completedTodos = todos.filter(todo => todo.completed);

    if (completedTodos.length === 0) {
      return;
    }

    setProcessingTodos(prev => [...prev, ...completedTodos.map(t => t.id)]);

    const deletionPromises = completedTodos.map(async todo => {
      try {
        await deleteTodo(todo.id);

        return { id: todo.id, success: true };
      } catch (e) {
        showError(ErrorType.DeleteTodo);

        return { id: todo.id, success: false };
      }
    });

    const results = await Promise.allSettled(deletionPromises);

    const successfulIds = results
      .filter(r => r.status === 'fulfilled' && r.value.success)
      .map(
        r =>
          (r as PromiseFulfilledResult<{ id: number; success: boolean }>).value
            .id,
      );

    setProcessingTodos(prev => prev.filter(id => !successfulIds.includes(id)));

    setTodos(prevTodos =>
      prevTodos.filter(todo => !successfulIds.includes(todo.id)),
    );

    setTimeout(() => {
      newTodoFieldRef.current?.focus();
    }, 0);
  }, [todos, showError, clearError]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        {loading && todos.length === 0 ? (
          <div className="loader">Loading todos...</div>
        ) : (
          <>
            <header className="todoapp__header">
              {todos.length > 0 && (
                <ToggleAllButton
                  isAllCompleted={isAllCompleted}
                  todosCount={todos.length}
                  onToggleAll={handleToggleAll}
                />
              )}

              <NewTodoForm
                onCreate={handleAddTodo}
                fieldRef={newTodoFieldRef}
                disabled={processingTodos.includes(0)}
              />
            </header>

            {shouldShowList && (
              <section className="todoapp__main" data-cy="TodoList">
                {filteredTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    onStatusChange={handleStatusChange}
                    onRename={handleRenameTodo}
                    isLoading={processingTodos.includes(todo.id)}
                  />
                ))}
                {tempTodo && (
                  <TodoItem
                    key={tempTodo.id}
                    todo={tempTodo}
                    onDelete={() => {}}
                    onStatusChange={() => {}}
                    onRename={async () => {}}
                    isLoading={true}
                  />
                )}
              </section>
            )}

            {shouldShowList && (
              <Footer
                activeTodosCount={activeTodosCount}
                currentFilter={filter}
                onFilterChange={handleFilterChange}
                hasCompletedTodos={hasCompletedTodos}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification error={error} clearError={clearError} />
    </div>
  );
};
