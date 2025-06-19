import { Todo } from '../types/Todo';
import { FilterOptions } from '../components/StatusFilter';

export interface GetFilteredTodosFilter {
  status: FilterOptions;
}

export const getFilteredTodos = (
  todos: Todo[],
  filter: GetFilteredTodosFilter,
) => {
  return todos.filter(todo => {
    switch (filter.status) {
      case FilterOptions.Active:
        return !todo.completed;

      case FilterOptions.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
};
