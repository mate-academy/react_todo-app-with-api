import { Todo } from '../types/Todo';

export function replaceTodo(
  todos: Todo[],
  index: number,
  newItem: Todo | null = null,
) {
  const newTodos = [...todos];

  if (newItem) {
    newTodos.splice(index, 1, newItem);
  } else {
    newTodos.splice(index, 1);
  }

  return newTodos;
}
