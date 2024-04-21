import { deleteTodo } from '../api/todos';
import { Setters } from '../types/Setters';
import { errorText } from '../constants';
import { TodoWithLoader } from '../types/TodoWithLoader';
import { item } from './utils';

export function handleDelete(todo: TodoWithLoader, setters: Setters) {
  setters.setLoading(true);
  setters.setErrorMessage('');
  item.updateLoading(todo, true, setters);

  return deleteTodo(todo.id)
    .then(() => {
      setters.setTodos(oldTodos => {
        return oldTodos.filter(oldTodo => oldTodo.id !== todo.id);
      });
    })
    .catch(error => {
      item.updateLoading(todo, false, setters);
      setters.setErrorMessage(errorText.failDeleting);
      throw error;
    })
    .finally(() => {
      setters.setLoading(false);
    })
    .then(() => setters.setSelectedTodo(null));
}
