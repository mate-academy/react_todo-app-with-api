/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
import { ErrorType } from './types/ErrorType';
import { Filter } from './types/Filter';

import { Header } from './Header';
import { TodoList } from './TodoList';
import { Footer } from './Footer';

const FILTERS: Record<Filter, Filter> = {
  all: 'all',
  active: 'active',
  completed: 'completed',
};

const ERROR_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(FILTERS.all);

  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoIds, setDeletingTodoIds] = useState<number[]>([]);
  const [updatingTodoIds, setUpdatingTodoIds] = useState<number[]>([]);

  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');

  const newTodoFieldRef = useRef<HTMLInputElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const editingTodoIdRef = useRef<number | null>(null);

  const shouldFocusNewTodoFieldRef = useRef<boolean>(false);
  const shouldFocusAfterDeleteRef = useRef<boolean>(false);

  const tempTodoIdRef = useRef<number>(-1);

  const hideError = (): void => {
    setError('');

    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
      errorTimerRef.current = null;
    }
  };

  const showError = (message: string): void => {
    if (errorTimerRef.current) {
      clearTimeout(errorTimerRef.current);
    }

    setError(message);

    errorTimerRef.current = setTimeout(() => {
      setError('');
      errorTimerRef.current = null;
    }, ERROR_TIMEOUT);
  };

  useEffect(() => {
    const loadTodos = async (): Promise<void> => {
      hideError();
      setIsLoading(true);

      try {
        const loadedTodos = await getTodos();

        setTodos(loadedTodos);
      } catch {
        showError(ErrorType.Load);
      } finally {
        setIsLoading(false);
      }
    };

    loadTodos();

    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isLoading) {
      newTodoFieldRef.current?.focus();
    }
  }, [isLoading]);

  useLayoutEffect(() => {
    if (!tempTodo && shouldFocusNewTodoFieldRef.current) {
      shouldFocusNewTodoFieldRef.current = false;
      newTodoFieldRef.current?.focus();
    }

    if (shouldFocusAfterDeleteRef.current) {
      shouldFocusAfterDeleteRef.current = false;
      newTodoFieldRef.current?.focus();
    }
  }, [tempTodo, todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter((todo: Todo): boolean => {
    switch (filter) {
      case FILTERS.active:
        return !todo.completed;

      case FILTERS.completed:
        return todo.completed;

      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(
    (todo: Todo): boolean => !todo.completed,
  ).length;

  const hasCompletedTodos = todos.some((todo: Todo): boolean => todo.completed);

  const allTodosCompleted =
    todos.length > 0 && todos.every((todo: Todo): boolean => todo.completed);

  const handleAddTodo = async (): Promise<void> => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(ErrorType.EmptyTitle);

      return;
    }

    hideError();

    const temporaryTodo: Todo = {
      id: tempTodoIdRef.current,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    tempTodoIdRef.current -= 1;
    shouldFocusNewTodoFieldRef.current = true;

    setTempTodo(temporaryTodo);

    try {
      const createdTodo = await addTodo({
        userId: USER_ID,
        title: trimmedTitle,
        completed: false,
      });

      setTodos((currentTodos: Todo[]): Todo[] => [
        ...currentTodos,
        createdTodo,
      ]);

      setTitle('');
    } catch {
      showError(ErrorType.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number): Promise<void> => {
    setDeletingTodoIds((currentIds: number[]): number[] => [
      ...currentIds,
      todoId,
    ]);

    try {
      await deleteTodo(todoId);

      shouldFocusAfterDeleteRef.current = true;

      setTodos((currentTodos: Todo[]): Todo[] =>
        currentTodos.filter((todo: Todo): boolean => todo.id !== todoId),
      );
    } catch {
      showError(ErrorType.Delete);
    } finally {
      setDeletingTodoIds((currentIds: number[]): number[] =>
        currentIds.filter((id: number): boolean => id !== todoId),
      );
    }
  };

  const handleToggleTodo = async (todo: Todo): Promise<void> => {
    setUpdatingTodoIds((currentIds: number[]): number[] => [
      ...currentIds,
      todo.id,
    ]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        completed: !todo.completed,
      });

      setTodos((currentTodos: Todo[]): Todo[] =>
        currentTodos.map(
          (currentTodo: Todo): Todo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );
    } catch {
      showError(ErrorType.Update);
    } finally {
      setUpdatingTodoIds((currentIds: number[]): number[] =>
        currentIds.filter((id: number): boolean => id !== todo.id),
      );
    }
  };

  const handleToggleAll = async (): Promise<void> => {
    const newCompletedStatus = !allTodosCompleted;

    const todosToUpdate = todos.filter(
      (todo: Todo): boolean => todo.completed !== newCompletedStatus,
    );

    if (todosToUpdate.length === 0) {
      return;
    }

    const todoIdsToUpdate = todosToUpdate.map((todo: Todo): number => todo.id);

    setUpdatingTodoIds((currentIds: number[]): number[] => [
      ...currentIds,
      ...todoIdsToUpdate.filter(
        (id: number): boolean => !currentIds.includes(id),
      ),
    ]);

    const results = await Promise.allSettled(
      todosToUpdate.map((todo: Todo) =>
        updateTodo(todo.id, {
          completed: newCompletedStatus,
        }),
      ),
    );

    const successfulTodos: Todo[] = results
      .filter(
        (result): result is PromiseFulfilledResult<Todo> =>
          result.status === 'fulfilled',
      )
      .map((result: PromiseFulfilledResult<Todo>): Todo => result.value);

    setTodos((currentTodos: Todo[]): Todo[] =>
      currentTodos.map((todo: Todo): Todo => {
        const updatedTodo = successfulTodos.find(
          (updated: Todo): boolean => updated.id === todo.id,
        );

        return updatedTodo || todo;
      }),
    );

    setUpdatingTodoIds((currentIds: number[]): number[] =>
      currentIds.filter((id: number): boolean => !todoIdsToUpdate.includes(id)),
    );

    if (results.some((result): boolean => result.status === 'rejected')) {
      showError(ErrorType.Update);
    }
  };

  const handleStartEditing = (todo: Todo): void => {
    if (
      deletingTodoIds.includes(todo.id) ||
      updatingTodoIds.includes(todo.id)
    ) {
      return;
    }

    editingTodoIdRef.current = todo.id;

    setEditingTodoId(todo.id);
    setEditTitle(todo.title);
  };

  const handleCancelEditing = (): void => {
    editingTodoIdRef.current = null;

    setEditingTodoId(null);
    setEditTitle('');
  };

  const handleEditTitleChange = (value: string): void => {
    setEditTitle(value);
  };

  const handleSubmitEdit = async (): Promise<void> => {
    const todoId = editingTodoIdRef.current;

    if (todoId === null) {
      return;
    }

    const todo = todos.find(
      (currentTodo: Todo): boolean => currentTodo.id === todoId,
    );

    if (!todo) {
      handleCancelEditing();

      return;
    }

    const trimmedTitle = editTitle.trim();

    if (trimmedTitle === todo.title) {
      handleCancelEditing();

      return;
    }

    if (!trimmedTitle) {
      await handleDeleteTodo(todo.id);

      return;
    }

    setUpdatingTodoIds((currentIds: number[]): number[] => [
      ...currentIds,
      todo.id,
    ]);

    try {
      const updatedTodo = await updateTodo(todo.id, {
        title: trimmedTitle,
      });

      setTodos((currentTodos: Todo[]): Todo[] =>
        currentTodos.map(
          (currentTodo: Todo): Todo =>
            currentTodo.id === todo.id ? updatedTodo : currentTodo,
        ),
      );

      handleCancelEditing();
    } catch {
      showError(ErrorType.Update);
    } finally {
      setUpdatingTodoIds((currentIds: number[]): number[] =>
        currentIds.filter((id: number): boolean => id !== todo.id),
      );
    }
  };

  const handleClearCompleted = async (): Promise<void> => {
    const completedTodos = todos.filter(
      (todo: Todo): boolean => todo.completed,
    );

    if (completedTodos.length === 0) {
      return;
    }

    const completedTodoIds = completedTodos.map(
      (todo: Todo): number => todo.id,
    );

    setDeletingTodoIds((currentIds: number[]): number[] => [
      ...currentIds,
      ...completedTodoIds.filter(
        (id: number): boolean => !currentIds.includes(id),
      ),
    ]);

    const results = await Promise.allSettled(
      completedTodos.map((todo: Todo) => deleteTodo(todo.id)),
    );

    const successfullyDeletedIds = completedTodos
      .filter(
        (_todo: Todo, index: number): boolean =>
          results[index].status === 'fulfilled',
      )
      .map((todo: Todo): number => todo.id);

    if (successfullyDeletedIds.length > 0) {
      shouldFocusAfterDeleteRef.current = true;
    }

    setTodos((currentTodos: Todo[]): Todo[] =>
      currentTodos.filter(
        (todo: Todo): boolean => !successfullyDeletedIds.includes(todo.id),
      ),
    );

    setDeletingTodoIds((currentIds: number[]): number[] =>
      currentIds.filter(
        (id: number): boolean => !completedTodoIds.includes(id),
      ),
    );

    if (results.some((result): boolean => result.status === 'rejected')) {
      showError(ErrorType.Delete);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          title={title}
          isAdding={tempTodo !== null}
          isLoading={isLoading}
          hasTodos={todos.length > 0}
          allTodosCompleted={allTodosCompleted}
          canToggleAll={todos.length > 0 && updatingTodoIds.length === 0}
          onToggleAll={handleToggleAll}
          onTitleChange={setTitle}
          onSubmit={handleAddTodo}
          inputRef={newTodoFieldRef}
        />

        {!isLoading && (todos.length > 0 || tempTodo !== null) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            deletingTodoIds={deletingTodoIds}
            updatingTodoIds={updatingTodoIds}
            editingTodoId={editingTodoId}
            editTitle={editTitle}
            onDelete={handleDeleteTodo}
            onToggle={handleToggleTodo}
            onStartEditing={handleStartEditing}
            onEditTitleChange={handleEditTitleChange}
            onSubmitEdit={handleSubmitEdit}
            onCancelEdit={handleCancelEditing}
          />
        )}

        {!isLoading && todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            hasCompletedTodos={hasCompletedTodos}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !error,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hideError}
        />

        {error}
      </div>
    </div>
  );
};
