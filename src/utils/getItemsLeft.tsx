import { Todo } from '../types/TempTodo';

export const getItemsLeft = (todos: Todo[]) => {
  return todos.reduce((acc, t) => {
    if (!t.completed) {
      return acc + 1;
    }

    return acc;
  }, 0);
};
