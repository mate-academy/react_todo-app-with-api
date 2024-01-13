import { Todo } from '../types/Todo';
import { Status } from '../types/Status';

export const todosStatusMap = (todos: Todo[]): {
  [key in Status]: () => Todo[];
} => ({
  Completed: () => todos.filter(todo => todo.completed),
  Active: () => todos.filter(todo => !todo.completed),
  All: () => todos,
});
