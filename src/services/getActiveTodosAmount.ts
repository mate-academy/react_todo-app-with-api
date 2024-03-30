import { Todo } from '../types/Todo';

export function getActiveTodosAmount(todos: Todo[]) {
  return todos.reduce((acc, cur) => {
    if (!cur.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);
}
