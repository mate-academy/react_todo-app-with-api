import { Todo } from '../types/Todo';

export const checkIfAllTodosCompleted = (todos: Todo[]) => (
  todos.every(currentTodo => (
    currentTodo.completed === true
  ))
);
