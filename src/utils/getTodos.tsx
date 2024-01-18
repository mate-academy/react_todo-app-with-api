import { Todo } from '../types/Todo';

export function getCompletedTodos(allTodos: Todo[]) {
  return allTodos.filter(todo => todo.completed);
}

export function getNotCompletedTodos(allTodos: Todo[]) {
  return allTodos.filter(todo => !todo.completed);
}
