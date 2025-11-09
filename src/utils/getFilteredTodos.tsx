import { FilterStatus } from '../components/Filter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (
  todosToFilter: Todo[],
  filters: FilterStatus,
) => {
  switch (filters) {
    case FilterStatus.Active:
      return todosToFilter.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return todosToFilter.filter(todo => todo.completed);
    case FilterStatus.All:
    default:
      return todosToFilter;
  }
};
