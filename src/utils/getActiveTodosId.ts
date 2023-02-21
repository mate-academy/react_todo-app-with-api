import { Todo } from '../types/Todo';

export const getActiveTodosId = (todos: Todo[]) => {
  return todos.filter((todo) => !todo.completed);
};
