import { Filter } from './types/types';

export const completedTodosCheck = (todosArray) => todosArray
  .every(todo => todo.completed);

export const filteredTodos = (todos, filter) => todos.filter((todo) => {
  switch (filter) {
    case Filter.Active:
      return !todo.completed;
    case Filter.Completed:
      return todo.completed;
    default:
      return true;
  }
});
