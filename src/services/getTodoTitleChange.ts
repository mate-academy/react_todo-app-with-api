import { Todo } from '../types/Todo';
import { updateTodo } from '../api/todos';
import { ErrorMessages } from '../types/Errors';

interface TitleChangeParams {
  currentTodos: Todo[];
  currentTodo: Todo;
  newTitle: string;
  addLoading: (ids: number | number[]) => void;
  deleteLoading: (ids: number | number[]) => void;
  onTodosUpdating: (todos: Todo[]) => void;
  onError: (errorMessage: ErrorMessages) => void;
}

export function getTodoTitleChange({
  currentTodos,
  currentTodo,
  newTitle,
  addLoading,
  deleteLoading,
  onTodosUpdating,
  onError,
}: TitleChangeParams) {
  const index = currentTodos.findIndex(({ id }) => id === currentTodo.id);

  onTodosUpdating([
    ...currentTodos.slice(0, index),
    { ...currentTodo, title: newTitle },
    ...currentTodos.slice(index + 1),
  ]);

  addLoading(currentTodo.id);

  return updateTodo({ ...currentTodo, title: newTitle })
    .catch(() => {
      onError(ErrorMessages.Updating);
      onTodosUpdating(currentTodos);

      throw Error();
    })
    .finally(() => {
      deleteLoading(currentTodo.id);
    });
}
