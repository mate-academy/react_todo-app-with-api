/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useCallback, useMemo,
} from 'react';
import cn from 'classnames';
import { UserWarning } from './UserWarning';
import {
  getTodos, createTodo, removeTodo, updateTodo,
} from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { Filter } from './utils/Filter';
import { Error } from './components/Error';
import { Todo } from './types/Todo';
import { AddTodoForm } from './components/AddTodoForm';
import { ErrorType } from './utils/ErrorType';
import { USER_ID } from './utils/constants';
import { TodoData } from './types/TodoData';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filter.All);
  const [hasError, setHasError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);
  const [isUpdatingTodoId, setIsUpdatingTodoId] = useState<number | null>(null);

  const loadTodos = async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch {
      setHasError(ErrorType.LOAD);
    }
  };

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

  const handleUpdateTodo = useCallback(async (todoId: number) => {
    setHasError('');
    setIsUpdatingTodoId(todoId);
    try {
      const todoToUpdate = todos.find(todo => todo.id === todoId);

      await updateTodo(todoId, !todoToUpdate?.completed);
      setTodos(prevTodos => {
        return (
          prevTodos.map(todo => {
            if (todoToUpdate?.id === todo.id) {
              todoToUpdate.completed = !todoToUpdate.completed;

              return todoToUpdate;
            }

            return todo;
          })
        );
      });
    } catch {
      setHasError(ErrorType.UPDATE);
    } finally {
      setIsUpdatingTodoId(null);
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
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          />

          <AddTodoForm
            onError={setHasError}
            onAddTodo={handleAddTodo}
            isLoadingForm={isLoading}
          />
        </header>

        {showTodos && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={handleDeleteTodo}
              completedTodosId={completedTodosId}
              onUpdate={handleUpdateTodo}
              isUpdatingTodoId={isUpdatingTodoId}
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
