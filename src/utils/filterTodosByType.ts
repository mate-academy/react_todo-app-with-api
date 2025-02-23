import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  typeFilter: FilterType,
): Todo[] => {
  const filtered = [...todos];

  switch (typeFilter) {
    case FilterType.ACTIVE:
      return filtered.filter(todo => !todo.completed);
    case FilterType.COMPLETED:
      return filtered.filter(todo => todo.completed);
    case FilterType.ALL:
      return filtered;
  }

  return filtered;
};
