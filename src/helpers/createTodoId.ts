import { Todo } from '../types/Todo';

export const createTodoId = (todos: Todo[]): number => {
  const todosId: number[] = todos.map(todo => todo.id);

  if (todos.length === 0) {
    return 1;
  }

  return Math.max(...todosId) + 1;
};
