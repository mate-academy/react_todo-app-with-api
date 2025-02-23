import { deleteTodo } from '../api/todos';
import { DeletingParams } from '../types/DeletingParams';
import { ErrorMessages } from '../types/Errors';

export function getTodoDeleting({
  currentTodos,
  activeTodos,
  addLoading,
  deleteLoading,
  onTodoDeleting,
  onError,
}: DeletingParams) {
  return {
    todo(id: number) {
      addLoading(id);

      deleteTodo(id)
        .then(() => {
          onTodoDeleting(currentTodos.filter(todo => todo.id !== id));
        })
        .catch(() => {
          onError(ErrorMessages.Deleting);
        })
        .finally(() => {
          deleteLoading(id);
        });
    },
    completedTodos(ids: number[]) {
      addLoading(ids);

      Promise.all(ids.map(id => deleteTodo(id)))
        .then(() => onTodoDeleting(activeTodos))
        .catch(() => onError(ErrorMessages.Deleting))
        .finally(() => {
          deleteLoading(ids);
        });
    },
  };
}
