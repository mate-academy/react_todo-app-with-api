import { Todo } from '../types/Todo';

export const getCompletedTodosId = (todos: Todo[]) => {
  return todos.filter((todo) => todo.completed)
    .map(todo => todo.id);
};
