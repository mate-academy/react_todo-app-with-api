import { useState } from 'react';
import { ErrorType } from '../types/ErrorType';
import { useTodos } from '../utils/TodoContext';
import { patchTodo } from '../api/todos';

type UseToggleTodoStatusProps = {
  toggleTodoStatus: (id: number, completed: boolean) => Promise<boolean>;
  error: ErrorType | null;
  isToggling: boolean;
};

export const useToggleTodoStatus = (): UseToggleTodoStatusProps => {
  const { setTodos } = useTodos();
  const [error, setError] = useState<ErrorType | null>(null);
  const [isToggling, setIsToggling] = useState<boolean>(false);

  const toggleTodoStatus = async (
    id: number,
    completed: boolean,
  ): Promise<boolean> => {
    setIsToggling(true);

    try {
      await patchTodo(id, { completed });
      setTodos(prevTodos =>
        prevTodos.map(todo => (todo.id === id ? { ...todo, completed } : todo)),
      );
      setIsToggling(false);

      return true;
    } catch (thrownError) {
      setError(ErrorType.UnableToUpdateTodo);
      setIsToggling(false);

      return false;
    }
  };

  return {
    toggleTodoStatus,
    error,
    isToggling,
  };
};
