import { editTodo } from '../api/todos';
import { Setters } from '../types/Setters';
import { errorText } from '../constants';
import { TodoWithLoader } from '../types/TodoWithLoader';
import { item } from './utils';

export function handleUpdate(
  todo: TodoWithLoader,
  completedStatus: boolean,
  setters: Setters,
  title = '',
) {
  const newTitle = title.length === 0 ? todo.title : title;
  const newTodo: TodoWithLoader = {
    ...todo,
    title: newTitle,
    completed: completedStatus,
    loading: true,
  };

  setters.setLoading(true);
  setters.setErrorMessage('');
  item.updateLoading(todo, true, setters);

  return editTodo(todo.id, newTodo)
    .then(updatedTodo => {
      setters.setTodos(prevTodos => {
        return prevTodos.map(currentTodo => {
          if (currentTodo.id === updatedTodo.id) {
            setters.setUpdatedAt(new Date());

            return { ...updatedTodo, loading: false };
          }

          return currentTodo;
        });
      });
    })
    .catch(error => {
      setters.setErrorMessage(errorText.failUpdating);
      throw error;
    })
    .finally(() => {
      setters.setLoading(false);
      setters.setUpdatedAt(new Date());
      item.updateLoading(todo, false, setters);
    })
    .then(() => {
      setters.setSelectedTodo(null);
    });
}
