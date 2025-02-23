import { FilterStatus } from '../components/Filter';
import { Todo } from '../types';

export function filterTodos<T extends Todo>(
  todos: T[],
  filterStatus: FilterStatus,
) {
  return todos.filter(value => {
    switch (filterStatus) {
      case FilterStatus.Active:
        return !value.completed;
      case FilterStatus.Completed:
        return value.completed;
      case FilterStatus.All:
      default:
        return true;
    }
  });
}
