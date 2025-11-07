import { Dispatch, SetStateAction } from 'react';
import { ErrorMessages, Todo } from '../types';
import { updateTodos } from '../api/todos';

type Props = {
  preparedTodos: Todo[];

  onSetError: (error: ErrorMessages) => void;
  onSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const useToggleTodo = ({
  preparedTodos,

  onSetTodoIdLoading,
  onSetError,
}: Props) => {
  const handleToggleTodos = async (id: number) => {
    onSetTodoIdLoading(prev => [...prev, id]);
    const preparedForUpdate = preparedTodos.find(i => i.id === id);

    if (!preparedForUpdate) {
      return;
    }

    try {
      await updateTodos(
        { ...preparedForUpdate, completed: !preparedForUpdate.completed },
        id,
      );
      preparedForUpdate.completed = !preparedForUpdate.completed;
    } catch (err) {
      onSetError(ErrorMessages.Update);
    } finally {
      onSetTodoIdLoading([]);
    }
  };

  const toggleAllTodos = async () => {
    if (
      preparedTodos.every(todo => todo.completed === true) ||
      preparedTodos.every(todo => todo.completed === false)
    ) {
      preparedTodos.map(todo => handleToggleTodos(todo.id));
    } else {
      preparedTodos
        .filter(todo => todo.completed === false)
        .map(todo => handleToggleTodos(todo.id));
    }
  };

  return { handleToggleTodos, toggleAllTodos };
};
