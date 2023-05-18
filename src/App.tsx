/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import {
  getTodos, createTodo, removeTodo, updateTodoCompleted, updateTodoTitle,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './utils/Filter';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { ErrorType } from './utils/ErrorType';
import { USER_ID } from './utils/constants';
import { TodoData } from './types/TodoData';
import { Header } from './components/Header';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filter.All);
  const [hasError, setHasError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);
  const [isUpdatingTodoId, setIsUpdatingTodoId] = useState<number | null>(null);
  const [isCurrentlyUpdating, setIsCurrentlyUpdating] = useState(false);

  const loadTodos = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      setHasError(ErrorType.LOAD);
    }
  };

  const handleSettingError = useCallback((error: string) => {
    setHasError(error);
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setSelectedFilter(filter);
  }, []);

  const handleCloseError = useCallback(() => {
    setHasError('');
  }, []);

  const handleAddTodo = useCallback(async (newTodo: TodoData) => {
    setIsLoading(true);
    setHasError('');
    try {
      setTempTodo({ ...newTodo, id: 0 });
      const todoToAdd = await createTodo(newTodo);

      setTodos((currentTodos) => [...currentTodos, todoToAdd]);
    } catch {
      setHasError(ErrorType.ADD);
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleDeleteTodo = useCallback(async (todoId: number) => {
    setHasError('');
    try {
      await removeTodo(todoId);
      setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== todoId));
    } catch {
      setHasError(ErrorType.DELETE);
    }
  }, []);

  const handleClearCompleted = useCallback(async () => {
    const todosId = todos.filter((todo) => todo.completed).map((todo) => todo.id);

    setCompletedTodosId(todosId);

    todosId.forEach(todoId => handleDeleteTodo(todoId));
  }, [todos]);

  const handleUpdateTodo = useCallback(async (todoId: number, completed: boolean) => {
    setHasError('');
    setIsUpdatingTodoId(todoId);
    try {
      await updateTodoCompleted(todoId, completed);

      setTodos((currentTodos) => currentTodos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            completed,
          };
        }

        return todo;
      }));
    } catch {
      setHasError(ErrorType.UPDATE);
    } finally {
      setIsUpdatingTodoId(null);
    }
  }, [todos]);

  const handleUpdateTodoTitle = useCallback(async (todoId: number, title: string) => {
    setHasError('');
    setIsUpdatingTodoId(todoId);
    try {
      await updateTodoTitle(todoId, title);

      setTodos((currentTodos) => currentTodos.map((todo) => {
        if (todo.id === todoId) {
          return {
            ...todo,
            title,
          };
        }

        return todo;
      }));
    } catch {
      setHasError(ErrorType.UPDATE);
    } finally {
      setIsUpdatingTodoId(null);
    }
  }, []);

  const handleToggleAll = useCallback(async () => {
    setHasError('');
    setIsCurrentlyUpdating(true);

    const isAllCompleted = todos.every((todo) => todo.completed);

    try {
      await Promise.all(todos.map((todo) => updateTodoCompleted(todo.id, !isAllCompleted)));

      setTodos((currentTodos) => currentTodos.map((todo) => ({
        ...todo,
        completed: !isAllCompleted,
      })));
    } catch {
      setHasError(ErrorType.UPDATE);
    } finally {
      setIsCurrentlyUpdating(false);
    }
  }, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (selectedFilter) {
        case Filter.All:
          return true;
        case Filter.Active:
          return !todo.completed;
        case Filter.Completed:
          return todo.completed;
        default:
          return false;
      }
    });
  }, [todos, selectedFilter]);

  const activeTodosCount = useMemo(() => {
    return todos.filter((todo) => !todo.completed).length;
  }, [todos]);

  useEffect(() => {
    loadTodos();
  }, []);

  const isCompleted = todos.some((todo) => todo.completed);
  const isAllCompleted = todos.every((todo) => todo.completed);
  const showTodos = todos.length > 0 || tempTodo;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onError={handleSettingError}
          isLoadingForm={isLoading}
          onToggleAll={handleToggleAll}
          onAddTodo={handleAddTodo}
          isAllCompleted={isAllCompleted}
        />

        {showTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={handleDeleteTodo}
              completedTodosId={completedTodosId}
              onUpdate={handleUpdateTodo}
              isUpdatingTodoId={isUpdatingTodoId}
              isCurrentlyUpdating={isCurrentlyUpdating}
              onUpdateTodoTitle={handleUpdateTodoTitle}
            />
            <Footer
              onFilterChange={handleFilterChange}
              selectedFilter={selectedFilter}
              activeTodosCount={activeTodosCount}
              isCompleted={isCompleted}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      {hasError && (
        <Error
          error={hasError}
          onCloseError={handleCloseError}
        />
      )}
    </div>
  );
};
