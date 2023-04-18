/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  deleteTodo,
  getTodos,
  postTodo,
  patchTodo,
} from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './components/ErrorMessage';
import { AppError } from './types/AppError';
import { filterTodos, FilterType } from './helpers/filterTodos';
import { TodoItem } from './components/TodoItem';
import { getActiveTodosCount, getHasCompletedTodos } from './helpers/getters';

const USER_ID = 6950;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterType, setFilterType] = useState(FilterType.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorType, setErrorType] = useState(AppError.None);
  const [loadingTodosIds, setLoadingTodosIds] = useState(new Set([0]));

  const activeTodosCount = getActiveTodosCount(todos);
  const hasCompletedTodos = getHasCompletedTodos(todos);

  const fetchTodos = useCallback(async () => {
    try {
      const apiTodos = await getTodos(USER_ID);

      setTodos(apiTodos);
    } catch {
      setErrorType(AppError.Get);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, []);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filterType),
    [filterType, todos],
  );

  const addTodo = useCallback(async (title: string) => {
    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    try {
      const newTodo = await postTodo(title, USER_ID);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      setErrorType(AppError.Post);
    } finally {
      setTempTodo(null);
    }
  }, []);

  const removeTodo = useCallback(async (todoId: number) => {
    try {
      setLoadingTodosIds(prev => {
        prev.add(todoId);

        return new Set(prev);
      });
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      setErrorType(AppError.Delete);
    } finally {
      setLoadingTodosIds(prev => {
        prev.delete(todoId);

        return new Set(prev);
      });
    }
  }, []);

  const removeAllCompleted = useCallback(async () => {
    const completedTodosIds = todos.reduce((acc: number[], el) => {
      return el.completed
        ? [...acc, el.id]
        : acc;
    }, []);

    try {
      setLoadingTodosIds(prev => {
        completedTodosIds.forEach(id => prev.add(id));

        return new Set(prev);
      });
      await Promise.all(completedTodosIds.map(id => deleteTodo(id)));
      setTodos(prev => prev.filter(({ id }) => (
        !completedTodosIds.includes(id)
      )));
    } catch {
      setErrorType(AppError.Delete);
    } finally {
      setLoadingTodosIds(prev => {
        completedTodosIds.forEach(id => prev.delete(id));

        return new Set(prev);
      });
    }
  }, [todos]);

  const updateTodo = useCallback(async (
    todoId: number,
    data: Partial<Omit<Todo, 'id'>>,
  ) => {
    try {
      setLoadingTodosIds(prev => {
        prev.add(todoId);

        return new Set(prev);
      });
      await patchTodo(todoId, data);
      setTodos(prev => prev.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setErrorType(AppError.Patch);
    } finally {
      setLoadingTodosIds(prev => {
        prev.delete(todoId);

        return new Set(prev);
      });
    }
  }, []);

  const toggleAllTodos = useCallback(async () => {
    let updatingTodosIds: number[] = [];

    try {
      if (activeTodosCount) {
        updatingTodosIds = todos
          .filter(({ completed }) => !completed)
          .map(({ id }) => id);

        setLoadingTodosIds(prev => {
          updatingTodosIds.forEach(id => prev.add(id));

          return new Set(prev);
        });
        await Promise.all(updatingTodosIds.map((
          id => (updateTodo(id, { completed: true }))
        )));
      } else {
        updatingTodosIds = todos
          .filter(({ completed }) => completed)
          .map(({ id }) => id);

        setLoadingTodosIds(prev => {
          updatingTodosIds.forEach(id => prev.add(id));

          return new Set(prev);
        });
        await Promise.all(updatingTodosIds.map((
          id => (updateTodo(id, { completed: false }))
        )));
      }
    } catch {
      setErrorType(AppError.Patch);
    } finally {
      setLoadingTodosIds(prev => {
        updatingTodosIds.forEach(id => prev.delete(id));

        return new Set(prev);
      });
    }
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          hasTodos={!!todos.length}
          toggleAllTodos={toggleAllTodos}
          hasActiveTodos={!!activeTodosCount}
          addTodo={addTodo}
        />

        <TodoList
          onUpdate={updateTodo}
          onDelete={removeTodo}
          todos={visibleTodos}
          loadingTodosIds={loadingTodosIds}
        />

        {tempTodo && <TodoItem todo={tempTodo} />}

        {!todos.length
          || (
            <Footer
              activeTodosCount={activeTodosCount}
              hasCompletedTodo={hasCompletedTodos}
              filterType={filterType}
              setFilter={setFilterType}
              removeAllCompleted={removeAllCompleted}
            />
          )}
      </div>

      {/* Add the 'hidden' class to hide the message smoothly */}
      {errorType !== AppError.None && (
        <ErrorMessage
          removeErrorMessage={() => setErrorType(AppError.None)}
          reloadData={fetchTodos}
          errorType={errorType}
        />
      )}
    </div>
  );
};
