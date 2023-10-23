import { Filters } from '../types/Filter';
import { Todo } from '../types/Todo';

export const filterTodos = (
  todos: Todo[],
  filter: Filters,
  uncompletedTodos: Todo[],
  completedTodos: Todo[],
): Todo[] => {
  switch (filter) {
    case Filters.Active:
      return uncompletedTodos;

    case Filters.Completed:
      return completedTodos;
    default:
      return todos;
  }
};
