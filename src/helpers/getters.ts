import { Todo } from '../types/Todo';

export const getHasCompletedTodos = (todos: Todo[]) => {
  return todos.some(({ completed }) => completed);
};

export const getActiveTodosCount = (todos: Todo[]) => {
  return todos.filter(({ completed }) => !completed).length;
};
