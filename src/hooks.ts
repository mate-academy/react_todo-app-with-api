import { useEffect, useState } from 'react';
import { getTodos } from './api/todos';
import { Errors, Todo } from './types';

export const useGetTodos = (USER_ID: number, makeAnyChange: boolean) => {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors>(Errors.noError);

  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await getTodos(USER_ID);

        setTodos(data);
      } catch (error) {
        setErrorMessage(Errors.load);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTodos();
  }, [makeAnyChange]);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => {
        setErrorMessage(Errors.noError);
      }, 3000);
    }
  }, [errorMessage]);

  const handleError = (error: Errors) => {
    setErrorMessage(error);
  };

  return {
    isLoading,
    todos,
    errorMessage,
    handleError,
  };
};
