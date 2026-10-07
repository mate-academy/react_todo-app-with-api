import React, { useEffect, useState } from 'react';
import {
  createTodo,
  deleteTodo,
  getTodos,
  patchTodo,
  USER_ID,
} from './api/todos';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { FILTERS } from './types/FilterType';
import { ERROR_MESSAGES } from './types/ErrorMessage';
import type { ErrorMessageType } from './types/ErrorMessage';
import type { FilterType } from './types/FilterType';
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

  const handleAddTodo = async (title: string) => {
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

  const handleDeleteTodo = async (todoId: number) => {
    setErrorMessage(null);
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

  const handleUpdateTodo = async (todoId: number, data: Partial<Todo>) => {
    setErrorMessage(null);
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

  const handleToggleTodo = async (todoId: number) => {
    const toggledTodo = todos.find(todo => todo.id === todoId);

    if (!toggledTodo) {
      return false;
    }

    return handleUpdateTodo(todoId, { completed: !toggledTodo.completed });
  };

  // header
  const handleToggleAll = () => {
    const newCompletedStatus = !isAllCompleted;

    todos
      .filter(todo => todo.completed !== newCompletedStatus)
      .forEach(todo => {
        handleUpdateTodo(todo.id, { completed: newCompletedStatus });
      });
  };

  // footer
  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedIds = completedTodos.map(todo => todo.id);

    setErrorMessage(null);
    setLoadingTodoIds(currentIds => [...currentIds, ...completedIds]);

    let hasError = false;

    const results = await Promise.all(
      completedIds.map(async id => {
        try {
          await deleteTodo(id);

          return id;
        } catch {
          hasError = true;

          return null;
        }
      }),
    );

    const deletedIds = results.filter((id): id is number => id !== null);

    if (hasError) {
      setErrorMessage(ERROR_MESSAGES.DELETE);
    }

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedIds.includes(todo.id)),
    );

    // spiner off
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
            onToggle={handleToggleTodo}
            onUpdate={handleUpdateTodo}
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

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
};
