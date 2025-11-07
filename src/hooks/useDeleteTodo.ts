import { Dispatch, RefObject, SetStateAction } from 'react';
import { deleteTodos } from '../api/todos';
import { ErrorMessages, Todo } from '../types';

type Props = {
  filteredTodos: Todo[];
  inputRef: RefObject<HTMLInputElement>;

  onSetPreparedTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onSetError: (error: ErrorMessages) => void;
  onSetTodoIdLoading: Dispatch<SetStateAction<number[]>>;
};

export const useDeleteTodos = ({
  filteredTodos,
  inputRef,

  onSetPreparedTodos,
  onSetError,
  onSetTodoIdLoading,
}: Props) => {
  const completedTodos = filteredTodos.filter(todo => todo.completed);

  const handleDeleteTodos = async (id: number) => {
    try {
      onSetTodoIdLoading(prev => [...prev, id]);
      await deleteTodos(id);
      onSetPreparedTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      onSetError(ErrorMessages.Delete);
    } finally {
      onSetTodoIdLoading([]);
      inputRef.current?.focus();
    }
  };

  const handleDeleteAllCompletedTodos = async () => {
    completedTodos.map(todo => handleDeleteTodos(todo.id));
  };

  return { handleDeleteTodos, handleDeleteAllCompletedTodos };
};
