import { Todo } from '../types/Todo';
import { FilterStatus } from '../types/FilterStatus';

export const getFilteredTodos = (
  todos: Todo[],
  filter: FilterStatus,
): Todo[] => {
  switch (filter) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);
    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
