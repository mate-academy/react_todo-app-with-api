import { editTodo } from '../api/todos';
import { Setters } from '../types/Setters';
import { errorText } from '../constants';
import { TodoWithLoader } from '../types/TodoWithLoader';
import { updateTodoLoading } from './utils';

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
  updateTodoLoading(todo, true, setters);

  return editTodo(todo.id, newTodo)
    .then(todo1 => {
      setters.setTodos(prevTodos => {
        const index = prevTodos.findIndex(
          currentTodo => todo1.id === currentTodo.id,
        );

        if (index >= 0) {
          prevTodos.splice(index, 1, { ...todo1, loading: false });
        }

        return prevTodos;
      });
    })
    .catch(error => {
      setters.setErrorMessage(errorText.failUpdating);
      throw error;
    })
    .finally(() => {
      setters.setLoading(false);
      updateTodoLoading(todo, false, setters);
    })
    .then(() => {
      setters.setSelectedTodo(null);
    });
}
