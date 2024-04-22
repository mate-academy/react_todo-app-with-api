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

  return editTodo(todo.id, newTodo)
    .then(currentTodo => {
      setters.setTodos(prevTodos => {
        return prevTodos.map(todo1 => {
          if (todo1.id === currentTodo.id) {
            setters.setUpdatedAt(new Date());

            return { ...todo1, loading: false };
          }

          return todo1;
        });
      });
    })
    .catch(error => {
      setters.setErrorMessage(errorText.failUpdating);
      throw error;
    })
    .finally(() => {
      setters.setLoading(false);
      item.updateLoading(todo, false, setters);
    })
    .then(() => {
      setters.setSelectedTodo(null);
    });
}
