import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoContext } from '../../context/Todo.context';
import { ErrorContext } from '../../context/Error.context';
import { editTodo } from '../../api/todos';

export const useCompleteTodo = () => {
  const { inputRef, onAddLoadingId, clearLoadingIds, onEditTodo } =
    useContext(TodoContext);

  const { onError } = useContext(ErrorContext);

  const onCompleteTodo = async (todo: Todo) => {
    const payload = {
      id: todo.id,
      completed: !todo.completed,
    };

    try {
      onAddLoadingId(todo.id);
      const response = await editTodo(payload);

      onEditTodo(response);
    } catch {
      onError('Unable to update a todo');
    } finally {
      clearLoadingIds();
      inputRef.current?.focus();
    }
  };

  return {
    onCompleteTodo,
  };
};
