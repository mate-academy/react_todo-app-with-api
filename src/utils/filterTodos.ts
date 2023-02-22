import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';

export const getFilteredTodos = (
  todos: Todo[],
  filterType: FilterOptions,
): Todo[] => {
  switch (filterType) {
    case FilterOptions.Active:
      return todos.filter(todo => !todo.completed);

    case FilterOptions.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
