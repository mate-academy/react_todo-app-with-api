import { Todo } from '../types/Todo';

export const getNotCompletedTodosAmmount = (todos: Todo[]) => (
  todos.filter(todo => !todo.completed).length
);
