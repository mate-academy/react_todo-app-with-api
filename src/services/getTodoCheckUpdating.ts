import { updateTodo } from '../api/todos';
import { CheckUpdatingParams } from '../types/CheckUpdatingParams';
import { ErrorMessages } from '../types/Errors';
import { Todo } from '../types/Todo';

export function getTodoCheckUpdating({
  currentTodos,
  addLoading,
  deleteLoading,
  onTodoUpdating,
  onError,
}: CheckUpdatingParams) {
  return {
    oneTodo({ id, ...rest }: Todo) {
      addLoading(id);

      updateTodo({ id, ...rest })
        .then(updatedTodo => {
          const index = currentTodos.findIndex(todo => todo.id === id);

          onTodoUpdating([
            ...currentTodos.slice(0, index),
            updatedTodo,
            ...currentTodos.slice(index + 1),
          ]);
        })
        .catch(() => {
          onError(ErrorMessages.Updating);
        })
        .finally(() => {
          deleteLoading(id);
        });
    },
    multipleTodos(toggledIds: number[], toggledTodos: Todo[]) {
      addLoading(toggledIds);

      Promise.all(toggledTodos.map(todo => updateTodo(todo)))
        .then(onTodoUpdating)
        .catch(() => onError(ErrorMessages.Updating))
        .finally(() => {
          deleteLoading(toggledIds);
        });
    },
  };
}
