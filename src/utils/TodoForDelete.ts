import { Todo } from '../types/types';

export function todosForDelete(todos: Todo[]) {
  return todos.filter(todo => todo.completed);
}
