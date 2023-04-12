/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useState } from 'react';
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
  const [hasError, setHasError] = useState(false);
  const [loadingTodosIds, setLoadingTodosIds] = useState([0]);

  const activeTodosCount = getActiveTodosCount(todos);
  const hasCompletedTodos = getHasCompletedTodos(todos);

  const fetchTodos = async () => {
    try {
      const apiTodos = await getTodos(USER_ID);

      setTodos(apiTodos);
    } catch {
      setHasError(true);
      setErrorType(AppError.Get);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const visibleTodos = useMemo(
    () => filterTodos(todos, filterType),
    [filterType, todos],
  );

  const addTodo = async (title: string) => {
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
      setHasError(true);
    } finally {
      setTempTodo(null);
    }
  };

  const removeTodo = async (todoId: number) => {
    try {
      setLoadingTodosIds(prev => [...prev, todoId]);
      await deleteTodo(todoId);
      setTodos(prev => prev.filter(({ id }) => id !== todoId));
    } catch {
      setHasError(true);
      setErrorType(AppError.Delete);
    } finally {
      setLoadingTodosIds(prev => prev.filter((id => id !== todoId)));
    }
  };

  const removeAllCompleted = async () => {
    const completedTodosIds = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    try {
      setLoadingTodosIds(prev => [...prev, ...completedTodosIds]);
      await Promise.all(completedTodosIds.map(id => deleteTodo(id)));
      setTodos(prev => prev.filter(({ id }) => (
        !completedTodosIds.includes(id)
      )));
    } catch {
      setHasError(true);
      setErrorType(AppError.Delete);
    } finally {
      setLoadingTodosIds(prev => (
        prev.filter(id => !completedTodosIds.includes(id))
      ));
    }
  };

  const updateTodo = async (
    todoId: number,
    data: Partial<Omit<Todo, 'id'>>,
  ) => {
    try {
      setLoadingTodosIds(prev => [...prev, todoId]);
      await patchTodo(todoId, data);
      setTodos(prev => prev.map((todo) => {
        if (todo.id === todoId) {
          return { ...todo, ...data };
        }

        return todo;
      }));
    } catch {
      setHasError(true);
      setErrorType(AppError.Patch);
    } finally {
      setLoadingTodosIds(prev => prev.filter(id => id !== todoId));
    }
  };

  const toggleAllTodos = async () => {
    let updatingTodosIds: number[];

    try {
      if (activeTodosCount) {
        updatingTodosIds = todos
          .filter(({ completed }) => !completed)
          .map(({ id }) => id);
        setLoadingTodosIds(prev => [...prev, ...updatingTodosIds]);
        await Promise.all(updatingTodosIds.map((
          id => (updateTodo(id, { completed: true }))
        )));
      } else {
        updatingTodosIds = todos
          .filter(({ completed }) => completed)
          .map(({ id }) => id);
        setLoadingTodosIds(prev => [...prev, ...updatingTodosIds]);
        await Promise.all(updatingTodosIds.map((
          id => (updateTodo(id, { completed: false }))
        )));
      }
    } catch {
      setHasError(true);
      setErrorType(AppError.Patch);
    } finally {
      setLoadingTodosIds(prev => prev.filter((
        id => !updatingTodosIds.includes(id)
      )));
    }
  };

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
      {hasError && (
        <ErrorMessage
          removeErrorMessage={() => setHasError(false)}
          reloadData={fetchTodos}
          errorType={errorType}
        />
      )}
    </div>
  );
};
