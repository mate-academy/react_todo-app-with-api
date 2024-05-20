import { deleteTodos } from '../helpers';
import { useAppContext } from './useAppContext';

export const useDeleteCompleted = () => {
  const { todos, setTodos, setErrorType, setTodoDeleteId, inputRef } =
    useAppContext();

  const onDeleteAllCompleted = async () => {
    try {
      const allCompleted = todos.filter(el => el.completed);

      const idToDelete = allCompleted.map(el => el.id);

      setTodoDeleteId(idToDelete);

      await Promise.all(
        allCompleted.map(async todo => {
          try {
            await deleteTodos(todo.id);

            setTodos(prevState => prevState.filter(el => el.id !== todo.id));
          } catch (err) {
            setErrorType('delete');
          }
        }),
      );

      inputRef.current?.focus();
    } finally {
      setTodoDeleteId(null);
    }
  };

  return { onDeleteAllCompleted };
};
