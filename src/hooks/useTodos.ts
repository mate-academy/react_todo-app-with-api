import { useEffect, useState } from 'react';
import { getTodos } from '../helpers';
import { ErrorType, Todo } from '../types';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorType, setErrorType] = useState<ErrorType | null>(null);

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const result = await getTodos();

        setTodos(result);
      } catch (er) {
        setErrorType('load');
      }
    };

    fetchTodo();
  }, []);

  return { todos, setTodos, errorType, setErrorType };
};
