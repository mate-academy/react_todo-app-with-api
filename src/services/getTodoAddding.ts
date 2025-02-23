import { addTodo } from '../api/todos';
import { AddingParams } from '../types/AddingParams';
import { ErrorMessages } from '../types/Errors';
import { Todo } from '../types/Todo';

export function getTodoAdding({
  currentTodos,
  newTodoTitle,
  userId,
  onTempTodoAdd,
  onTodoAdding,
  onError,
}: AddingParams) {
  const addedTodo: Todo = {
    id: 0,
    userId: userId,
    title: newTodoTitle,
    completed: false,
  };

  onTempTodoAdd(addedTodo);

  return addTodo(addedTodo)
    .then(todo => onTodoAdding([...currentTodos, todo]))
    .catch(() => {
      onError(ErrorMessages.Adding);
      throw Error();
    })
    .finally(() => {
      onTempTodoAdd(null);
    });
}
