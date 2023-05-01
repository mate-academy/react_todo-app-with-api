import { Todo } from '../types/Todo';
import { FilterType } from '../utils/filterTypes';

export const filterTodos = (
  allTodos: Todo[],
  filterMode: FilterType,
): Todo[] => {
  switch (filterMode) {
    case FilterType.Active:
      return allTodos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return allTodos.filter(todo => todo.completed);

    default:
      return allTodos;
  }
};
