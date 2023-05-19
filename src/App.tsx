import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import {
  getTodos, addTodos, removeTodos, changeTodosCompleted, changeTodosTitle,
} from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Error } from './components/ErrorMessage/ErrorMessage';
import { Footer } from './components/TodoFooter/TodoFooter';
import { Filter } from './types/Filter';
import { AddTodoForm } from './components/TodoHeader/TodoHeader';
import { TodoData } from './types/TodoData';

const USER_ID = 10333;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState(Filter.All);
  const [hasError, setHasError] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);
  const [isUpdatingTodoId, setIsUpdatingTodoId] = useState<number | null>(null);
  const [isUpdating, setisUpdating] = useState(false);

  let timeoutId: ReturnType<typeof setTimeout>;

  const loadTodos = useCallback(async () => {
    try {
      const response = await getTodos(USER_ID);

      setTodos(response);
    } catch (error) {
      setHasError('Unable to load a todo');

      timeoutId = setTimeout(() => {
        setHasError('');
      }, 3000);

      return () => clearTimeout(timeoutId);
    }

    return () => {};
  }, [USER_ID, setTodos, setHasError]);

  useEffect(() => {
    loadTodos();

    return () => {
      clearTimeout(timeoutId);
    };
  }, []);

  const handleSettingError = useCallback((error: string) => {
    setHasError(error);
  }, []);

  const handleCloseError = useCallback(() => {
    setHasError('');
  }, []);

  const handleFilterChange = useCallback((filter: Filter) => {
    setSelectedFilter(filter);
  }, []);

  const handleAddTodo = useCallback(async (newTodo: TodoData) => {
    setIsLoading(true);
    setHasError('');
    try {
      setTempTodo({ ...newTodo, id: 0 });
      const todoToAdd = await addTodos(newTodo);

      setTodos((currentTodos) => [...currentTodos, todoToAdd]);
    } catch {
      setHasError('Unable to add a todo');
    } finally {
      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const handleRemoveTodo = useCallback(async (todoId: number) => {
    setHasError('');
    try {
      await removeTodos(todoId);
      setTodos((currentTodos) => currentTodos
        .filter((todo) => todo.id !== todoId));
    } catch {
      setHasError('Unable to delete a todo');
    }
  }, []);

  const handleClearCompleted = useCallback(async () => {
    const todosId = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    setCompletedTodosId(todosId);

    todosId.forEach((todoId) => handleRemoveTodo(todoId));
  }, [todos]);

  const handleUpdateTodo = useCallback(
    async (todoId: number, completed: boolean) => {
      setHasError('');
      setIsUpdatingTodoId(todoId);
      try {
        await changeTodosCompleted(todoId, completed);

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
        setHasError('Unable to update a todo');
      } finally {
        setIsUpdatingTodoId(null);
      }
    }, [todos],
  );

  const handleUpdateTodoTitle = useCallback(
    async (todoId: number, title: string) => {
      setHasError('');
      setIsUpdatingTodoId(todoId);
      try {
        await changeTodosTitle(todoId, title);

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
        setHasError('Unable to update a todo');
      } finally {
        setIsUpdatingTodoId(null);
      }
    }, [],
  );

  const handleToggleAll = useCallback(async () => {
    setHasError('');
    setisUpdating(true);

    const isAllCompleted = todos.every((todo) => todo.completed);

    try {
      await Promise.all(
        todos.map((todo) => changeTodosCompleted(todo.id, !isAllCompleted)),
      );

      setTodos((currentTodos) => currentTodos.map((todo) => ({
        ...todo,
        completed: !isAllCompleted,
      })));
    } catch {
      setHasError('Unable to update a todo');
    } finally {
      setisUpdating(false);
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

  const activeTodosCount = todos.filter((todo) => !todo.completed).length;

  useEffect(() => {
    loadTodos();
  }, []);

  const isCompleted = todos.some((todo) => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />
          <AddTodoForm
            onError={handleSettingError}
            onAddTodo={handleAddTodo}
            isLoadingForm={isLoading}
            onToggleAll={handleToggleAll}
            isAllCompleted={isCompleted}
          />
        </header>

        {!hasError && !!todos.length && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDeleteTodo={handleRemoveTodo}
              completedTodosId={completedTodosId}
              onUpdate={handleUpdateTodo}
              isUpdatingTodoId={isUpdatingTodoId}
              isUpdating={isUpdating}
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

        {hasError && <Error error={hasError} onCloseError={handleCloseError} />}
      </div>
    </div>
  );
};
