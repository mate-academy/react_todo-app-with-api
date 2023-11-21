import { FilterOption } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filter: string) => {
  return todos.filter(({ completed }) => {
    switch (filter) {
      case FilterOption.Active:
        return !completed;
      case FilterOption.Completed:
        return completed;
      case FilterOption.All:
      default:
        return true;
    }
  });
};
