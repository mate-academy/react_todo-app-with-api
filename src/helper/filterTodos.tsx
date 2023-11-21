import { Todo } from '../types/Todo';
import { FilterTodos } from '../types/FilterTodos';

export const getFilteredTodos = (todos: Todo[], filtredTodos: string) => {
  return todos.filter(({ completed }) => {
    switch (filtredTodos) {
      case FilterTodos.Active:
        return !completed;
      case FilterTodos.Completed:
        return completed;
      case FilterTodos.All:
      default:
        return true;
    }
  });
};
