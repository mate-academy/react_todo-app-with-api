import { Todo } from '../types/Todo';

export const useUncompletedTodos = (todos: Todo[]) => (
  todos.filter((todo) => !todo.completed)
);
