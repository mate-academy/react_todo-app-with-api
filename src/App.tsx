/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoApp } from './components/TodoApp';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorMessage } from './components/ErrorMessage';
import { todosApi } from './api/todos';
import './App.scss';
import { UpdateTodo } from './types/UpdateTodo';
import { errorMessages } from './types/ErrorMessages';
import { filterState } from './types/FilterState';

const USER_ID = 10914;

export const App: React.FC = () => {
  const [usersTodos, setUsersTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<string>(filterState.ALL);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);

  useEffect(() => {
    todosApi.getTodos(USER_ID)
      .then(setUsersTodos)
      .catch(() => setErrorMessage(errorMessages.UNABLE_TO_LOAD_TODOS));
  }, []);

  useEffect(() => {
    setTimeout(() => setErrorMessage(''), 3000);
  }, [errorMessage]);

  const createTodo = async (
    title: string,
  ) : Promise<Todo | null> => {
    try {
      const newTodo = await todosApi.createTodo({
        userId: USER_ID,
        completed: false,
        title,
      });

      setUsersTodos(prevTodos => [...prevTodos, newTodo]);

      return newTodo;
    } catch (error) {
      setErrorMessage(errorMessages.UNABLE_TO_ADD_TODO);

      return null;
    }
  };

  const handleAddingNewTodo = useCallback(async (newTodoInput: string) => {
    if (!newTodoInput.trim()) {
      setErrorMessage(errorMessages.EMPTY_TITLE);
    } else {
      setIsLoading(true);
      setTempTodo({
        id: 0,
        title: newTodoInput,
        userId: USER_ID,
        completed: false,
      });

      await createTodo(newTodoInput);

      setTempTodo(null);
      setIsLoading(false);
    }
  }, []);

  const deleteTodo = async (id: number)
  : Promise<boolean | null> => {
    try {
      const response = await todosApi.deleteTodo(id);
      const isDeleted = Boolean(response);

      if (isDeleted) {
        setUsersTodos((prev) => prev.filter(todo => todo.id !== id));
      }

      return isDeleted;
    } catch (error) {
      setErrorMessage(errorMessages.UNABLE_TO_DELETE_TODO);

      return null;
    }
  };

  const handleDeletingTodo = useCallback(async (todoId: number) => {
    setIsLoading(true);
    setLoadingTodoId(prev => [...prev, todoId]);

    await deleteTodo(todoId);

    setLoadingTodoId([]);
    setIsLoading(false);
  }, []);

  const updateTodo = async (id: number, args: UpdateTodo)
  : Promise<Todo | null> => {
    try {
      const updatedTodo = await todosApi.updateTodo(id, args);

      setUsersTodos(prevTodos => prevTodos.map(todo => {
        if (todo.id !== id) {
          return todo;
        }

        return updatedTodo;
      }));

      return updatedTodo;
    } catch (error) {
      setErrorMessage(errorMessages.UNABLE_TO_UPDATE_TODO);

      return null;
    }
  };

  const handleUpdatingTodo = useCallback(async (
    todoId: number,
    args: UpdateTodo,
  ) => {
    setIsLoading(true);
    setLoadingTodoId(prev => [...prev, todoId]);

    await updateTodo(todoId, args);

    setLoadingTodoId([]);
    setIsLoading(false);
  }, []);

  let visibleTodos = [...usersTodos];

  switch (filter) {
    case filterState.ALL:
      visibleTodos = [...usersTodos];
      break;
    case filterState.ACTIVE:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;
    case filterState.COMPLETED:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;
    default:
      return null;
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isFooterNeeded = visibleTodos.length > 0 || filter !== 'all';
  const uncompletedTodosNumber
  = usersTodos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={visibleTodos}
          handleAddingNewTodo={handleAddingNewTodo}
          isLoading={isLoading}
          isAllTodosCompleted={usersTodos.every(todo => todo.completed)}
          handleUpdatingTodo={handleUpdatingTodo}
        />

        <TodoApp
          todos={visibleTodos}
          tempTodo={tempTodo}
          handleDeletingTodo={handleDeletingTodo}
          isLoading={isLoading}
          handleUpdatingTodo={handleUpdatingTodo}
          loadingTodoId={loadingTodoId}
        />

        {isFooterNeeded
        && (
          <Footer
            filter={filter}
            setFilter={setFilter}
            todosNumber={uncompletedTodosNumber}
            todos={visibleTodos}
            handleDeletingTodo={handleDeletingTodo}
          />
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
