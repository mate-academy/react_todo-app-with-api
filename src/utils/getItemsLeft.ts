import { Todo } from '../types/Todo';

export const getItemsLeft = (todos: Todo[]) => {
  return todos.reduce((acc, t) => {
    if (!t.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);
};
