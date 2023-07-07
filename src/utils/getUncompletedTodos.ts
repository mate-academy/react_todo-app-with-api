import { Todo } from '../types/Todo';

export const getUncompletedTodos = (todos: Todo[]) => (
  todos.filter(todo => !todo.completed)
);
