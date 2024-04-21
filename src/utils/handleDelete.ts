import { deleteTodo } from '../api/todos';
import { Setters } from '../types/Setters';
import { errorText } from '../constants';
import { TodoWithLoader } from '../types/TodoWithLoader';
import { updateTodoLoading } from './utils';

export function handleDelete(todo: TodoWithLoader, setters: Setters) {
  updateTodoLoading(todo, true, setters);

  return deleteTodo(todo.id)
    .then(() => {
      setters.setTodos(oldTodos => {
        return oldTodos.filter(oldTodo => oldTodo.id !== todo.id);
      });
    })
    .catch(error => {
      updateTodoLoading(todo, false, setters);
      setters.setErrorMessage(errorText.failDeleting);
      setters.setUpdatedAt(new Date());
      throw error;
    });
}
