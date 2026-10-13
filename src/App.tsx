/* eslint-disable import/extensions */
/* eslint-disable max-len */

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import {
  getTodos,
  addTodo,
  deleteTodo,
  updateTodo,
  USER_ID,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './components/TodoFilter/TodoFilter';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [isClearingCompleted, setIsClearingCompleted] = useState(false);
  const [error, setError] = useState<ErrorMessage | null>(null);
  const [deletingTodoIds, setDeletingTodoIds] = useState<Set<number>>(
    new Set(),
  );
  const [updatingTodoIds, setUpdatingTodoIds] = useState<Set<number>>(
    new Set(),
  );
  const [temporaryTodoIds, setTemporaryTodoIds] = useState<Set<number>>(
    new Set(),
  );

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const showError = useCallback((message: ErrorMessage) => {
    setError(message);
  }, []);

  useEffect(() => {
    if (!error) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setError(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [error]);

  useEffect(() => {
    const updateFilter = () => {
      if (window.location.hash === '#/active') {
        setFilter(Filter.Active);
      } else if (window.location.hash === '#/completed') {
        setFilter(Filter.Completed);
      } else {
        setFilter(Filter.All);
      }
    };

    window.addEventListener('hashchange', updateFilter);
    updateFilter();

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.Load);
      })
      .finally(() => {
        setIsLoading(false);
        inputRef.current?.focus();
      });

    return () => {
      window.removeEventListener('hashchange', updateFilter);
    };
  }, [showError]);

  const setTodoLoading = (todoId: number, loading: boolean) => {
    setDeletingTodoIds(currentIds => {
      const nextIds = new Set(currentIds);

      if (loading) {
        nextIds.add(todoId);
      } else {
        nextIds.delete(todoId);
      }

      return nextIds;
    });
  };

  const setTodoUpdating = (todoId: number, loading: boolean) => {
    setUpdatingTodoIds(currentIds => {
      const nextIds = new Set(currentIds);

      if (loading) {
        nextIds.add(todoId);
      } else {
        nextIds.delete(todoId);
      }

      return nextIds;
    });
  };

  const handleAdd = async (title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorMessage.EmptyTitle);
      inputRef.current?.focus();

      return false;
    }

    const temporaryId = -Date.now();

    const temporaryTodo = {
      id: temporaryId,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    } as Todo;

    setIsAdding(true);
    clearError();

    setTodos(currentTodos => [...currentTodos, temporaryTodo]);

    setTemporaryTodoIds(currentIds => {
      const nextIds = new Set(currentIds);

      nextIds.add(temporaryId);

      return nextIds;
    });

    setUpdatingTodoIds(currentIds => {
      const nextIds = new Set(currentIds);

      nextIds.add(temporaryId);

      return nextIds;
    });

    try {
      const newTodo = await addTodo({
        title: trimmedTitle,
        completed: false,
        userId: USER_ID,
      });

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === temporaryId ? newTodo : todo)),
      );

      setTemporaryTodoIds(currentIds => {
        const nextIds = new Set(currentIds);

        nextIds.delete(temporaryId);

        return nextIds;
      });

      return true;
    } catch {
      setTodos(currentTodos =>
        currentTodos.filter(todo => todo.id !== temporaryId),
      );

      showError(ErrorMessage.Add);

      return false;
    } finally {
      setUpdatingTodoIds(currentIds => {
        const nextIds = new Set(currentIds);

        nextIds.delete(temporaryId);

        return nextIds;
      });

      setIsAdding(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleDelete = async (todoId: number): Promise<boolean> => {
    if (deletingTodoIds.has(todoId) || updatingTodoIds.has(todoId)) {
      return false;
    }

    clearError();
    setTodoLoading(todoId, true);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      showError(ErrorMessage.Delete);

      return false;
    } finally {
      setTodoLoading(todoId, false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleToggle = (todo: Todo, completed: boolean) => {
    if (deletingTodoIds.has(todo.id) || updatingTodoIds.has(todo.id)) {
      return;
    }

    clearError();
    setTodoUpdating(todo.id, true);

    updateTodo(todo.id, { completed })
      .then(updatedTodo => {
        setTodos(currentTodos =>
          currentTodos.map(currentTodo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
          ),
        );
      })
      .catch(() => {
        showError(ErrorMessage.Update);
      })
      .finally(() => {
        setTodoUpdating(todo.id, false);
      });
  };

  const handleRename = async (todo: Todo, title: string): Promise<boolean> => {
    const trimmedTitle = title.trim();

    if (
      !trimmedTitle ||
      trimmedTitle === todo.title ||
      deletingTodoIds.has(todo.id) ||
      updatingTodoIds.has(todo.id)
    ) {
      return false;
    }

    clearError();
    setTodoUpdating(todo.id, true);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedTitle,
      });

      setTodos(currentTodos =>
        currentTodos.map(currentTodo =>
          currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );

      return true;
    } catch {
      showError(ErrorMessage.Update);

      return false;
    } finally {
      setTodoUpdating(todo.id, false);
    }
  };

  const handleToggleAll = async () => {
    if (
      todos.length === 0 ||
      deletingTodoIds.size > 0 ||
      updatingTodoIds.size > 0
    ) {
      return;
    }

    const shouldCompleteAll = todos.some(todo => !todo.completed);
    const todosToUpdate = todos.filter(
      todo => todo.completed !== shouldCompleteAll,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    clearError();

    todosToUpdate.forEach(todo => {
      setTodoUpdating(todo.id, true);
    });

    const results = await Promise.allSettled(
      todosToUpdate.map(todo =>
        updateTodo(todo.id, { completed: shouldCompleteAll }),
      ),
    );

    const updatedTodos = results
      .filter(
        (result): result is PromiseFulfilledResult<Todo> =>
          result.status === 'fulfilled',
      )
      .map(result => result.value);

    if (updatedTodos.length > 0) {
      setTodos(currentTodos =>
        currentTodos.map(
          currentTodo =>
            updatedTodos.find(todo => todo.id === currentTodo.id) ??
            currentTodo,
        ),
      );
    }

    if (results.some(result => result.status === 'rejected')) {
      showError(ErrorMessage.Update);
    }

    todosToUpdate.forEach(todo => {
      setTodoUpdating(todo.id, false);
    });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(
      todo => todo.completed && !temporaryTodoIds.has(todo.id),
    );

    if (completedTodos.length === 0 || isClearingCompleted) {
      return;
    }

    setIsClearingCompleted(true);
    clearError();

    completedTodos.forEach(todo => {
      setTodoLoading(todo.id, true);
    });

    const results = await Promise.allSettled(
      completedTodos.map(todo => deleteTodo(todo.id)),
    );

    const deletedIds = new Set(
      completedTodos
        .filter((_, index) => results[index].status === 'fulfilled')
        .map(todo => todo.id),
    );

    if (deletedIds.size > 0) {
      setTodos(currentTodos =>
        currentTodos.filter(todo => !deletedIds.has(todo.id)),
      );
    }

    if (results.some(result => result.status === 'rejected')) {
      showError(ErrorMessage.Delete);
    }

    completedTodos.forEach(todo => {
      setTodoLoading(todo.id, false);
    });

    setIsClearingCompleted(false);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  const todosForFooter = todos.filter(todo => !temporaryTodoIds.has(todo.id));

  const allCompleted = todos.length > 0 && todos.every(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && !isLoading && (
            <button
              type="button"
              className={`todoapp__toggle-all ${allCompleted ? 'active' : ''}`}
              data-cy="ToggleAllButton"
              aria-label="Toggle all todos"
              onClick={handleToggleAll}
              disabled={deletingTodoIds.size > 0 || updatingTodoIds.size > 0}
            />
          )}

          <form
            onSubmit={async event => {
              event.preventDefault();

              const input = inputRef.current;

              if (!input || isAdding) {
                return;
              }

              const added = await handleAdd(input.value);

              if (added) {
                input.value = '';
              }
            }}
          >
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={isAdding}
            />
          </form>
        </header>

        {isLoading ? (
          <div className="loader" data-cy="Loader" />
        ) : (
          <>
            {todos.length > 0 && (
              <TodoList
                todos={visibleTodos}
                deletingTodoIds={deletingTodoIds}
                updatingTodoIds={updatingTodoIds}
                onDelete={handleDelete}
                onToggle={handleToggle}
                onRename={handleRename}
              />
            )}

            {todos.length > 0 && (
              <TodoFooter
                todos={todosForFooter}
                filter={filter}
                deletingTodoIds={deletingTodoIds}
                isClearingCompleted={isClearingCompleted}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={clearError} />
    </div>
  );
};
