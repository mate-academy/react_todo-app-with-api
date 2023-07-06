import { FilterOptions } from '../types/FilterOptions';
import { Todo } from '../types/Todo';

export const filterTodos = (
  filter: FilterOptions,
  todos: Todo[],
  activeTodos: Todo[],
  completedTodos: Todo[],
) => {
  switch (filter) {
    case FilterOptions.ACTIVE:
      return activeTodos;

    case FilterOptions.COMPLETED:
      return completedTodos;

    default:
      return todos;
  }
};
