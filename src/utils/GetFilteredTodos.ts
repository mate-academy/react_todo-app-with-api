import { Todo } from '../types/Todo';
import { FilterOptions } from '../types/FilterOptions';

export function getFilteredTodos(
  todos: Todo[],
  filterOption: FilterOptions,
): Todo[] {
  return todos.filter(todo => {
    switch (filterOption) {
      case FilterOptions.Active:
        return !todo.completed;

      case FilterOptions.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}
