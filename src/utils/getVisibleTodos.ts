import { Todo } from '../types/Todo';
import { FilterStatus } from './filterStatus';

export const getVisibleTodos = (
  todos: Todo[],
  filter: FilterStatus,
): Todo[] => {
  return todos.filter(todo => {
    switch (filter) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
};
