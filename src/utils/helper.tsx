import { Todo } from '../types/Todo';

export const getActiveTodosCount = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed).length;
};
