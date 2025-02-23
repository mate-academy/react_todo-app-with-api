import { Todo } from '../types/Todo';

export const isAllTodosCompleted = (todos: Todo[]) =>
  todos.every(todo => todo.completed);

export const getAllActiveTodos = (todos: Todo[]) =>
  todos.filter(todo => !todo.completed).length;
