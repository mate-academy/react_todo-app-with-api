import { useContext } from 'react';
import { TodoContext } from '../../context/Todo.context';
import { deleteTodo } from '../../api/todos';
import { ErrorContext } from '../../context/Error.context';

export const useDeleteTodo = () => {
  const { inputRef, onAddLoadingId, clearLoadingIds, onDeleteTodo } =
    useContext(TodoContext);

  const { onError } = useContext(ErrorContext);

  const onDelete = async (id: number) => {
    try {
      onAddLoadingId(id);
      await deleteTodo(id);
      onDeleteTodo(id);
    } catch {
      onError('Unable to delete a todo');
    } finally {
      clearLoadingIds();
      inputRef.current?.focus();
    }
  };

  return {
    onDelete,
  };
};
