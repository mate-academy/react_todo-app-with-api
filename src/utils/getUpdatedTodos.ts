import { Todo } from '../types/Todo';

export const getUpdatedTodos = (
  todos: Todo[],
  todoId: number,
  newTodo: Todo,
) => {
  const index = todos
    .findIndex(currentTodo => currentTodo.id === todoId);

  todos.splice(index, 1, newTodo);

  return todos;
};
