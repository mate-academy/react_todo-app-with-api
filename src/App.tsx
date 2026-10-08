/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import type { FilterType } from './types/FilterType';
import type { ErrorMessageType } from './types/ErrorMessage';
import { FILTERS } from './types/FilterType';
import { ERROR_MESSAGES } from './types/ErrorMessage';
import type { Todo } from './types/Todo';

const ERROR_TIMEOUT = 3000;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>(FILTERS.all);
  const [errorMessage, setErrorMessage] = useState<ErrorMessageType | null>(
    null,
  );
  const isAllCompleted = todos.every(todo => todo.completed);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ERROR_MESSAGES.LOAD));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(null);
    }, ERROR_TIMEOUT);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleAddTodo = async (title: string): Promise<boolean> => {
    setIsSubmitting(true);
    setErrorMessage(null);
    setTempTodo({ id: 0, title, completed: false, userId: USER_ID });

    try {
      const newTodo = await createTodo({
        title,
        userId: USER_ID,
        completed: false,
      });

      setTodos(currentTodos => [...currentTodos, newTodo]);

      return true;
    } catch {
      setErrorMessage(ERROR_MESSAGES.ADD);

      return false;
    } finally {
      setIsSubmitting(false);
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoId: number): Promise<boolean> => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      await deleteTodo(todoId);

      setTodos(currentTodos => currentTodos.filter(todo => todo.id !== todoId));

      return true;
    } catch {
      setErrorMessage(ERROR_MESSAGES.DELETE);

      return false;
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const handleUpdateTodo = async (
    todoId: number,
    data: Partial<Todo>,
  ): Promise<boolean> => {
    setLoadingTodoIds(currentIds => [...currentIds, todoId]);

    try {
      const updatedTodo = await patchTodo(todoId, data);

      setTodos(currentTodos =>
        currentTodos.map(todo => (todo.id === todoId ? updatedTodo : todo)),
      );

      return true;
    } catch {
      setErrorMessage(ERROR_MESSAGES.UPDATE);

      return false;
    } finally {
      setLoadingTodoIds(currentIds => currentIds.filter(id => id !== todoId));
    }
  };

  const handleToggleTodo = async (todoId: number): Promise<boolean> => {
    const toggledTodo = todos.find(todo => todo.id === todoId);

    if (!toggledTodo) {
      return false;
    }

    return handleUpdateTodo(todoId, { completed: !toggledTodo.completed });
  };

  const handleToggleAll = () => {
    const newCompletedStatus = !isAllCompleted;

    todos
      .filter(todo => todo.completed !== newCompletedStatus)
      .forEach(todo => {
        handleUpdateTodo(todo.id, { completed: newCompletedStatus });
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(currentIds => [...currentIds, ...completedIds]);

    const deletedIds: number[] = [];
    let hasError = false;

    await Promise.all(
      completedIds.map(async id => {
        try {
          await deleteTodo(id);
          deletedIds.push(id);
        } catch {
          hasError = true;
        }
      }),
    );

    if (hasError) {
      setErrorMessage(ERROR_MESSAGES.DELETE);
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedIds.includes(todo.id)),
    );
    setLoadingTodoIds(currentIds =>
      currentIds.filter(id => !completedIds.includes(id)),
    );
  };

  const visibleTodos = todos.filter(todo => {
    if (selectedFilter === FILTERS.active) {
      return !todo.completed;
    }

    if (selectedFilter === FILTERS.completed) {
      return todo.completed;
    }

    return true;
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          isAllCompleted={isAllCompleted}
          isSubmitting={isSubmitting}
          todos={todos}
          onAdd={handleAddTodo}
          onError={setErrorMessage}
          onToggleAll={handleToggleAll}
        />

        {(todos.length > 0 || tempTodo) && (
          <TodoList
            todos={visibleTodos}
            tempTodo={tempTodo}
            loadingTodoIds={loadingTodoIds}
            onDelete={handleDeleteTodo}
            onUpdate={handleUpdateTodo}
            onToggle={handleToggleTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
