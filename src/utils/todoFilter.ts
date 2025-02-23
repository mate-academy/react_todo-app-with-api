import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const todoFilter = (
  filter: FilterType,
  currentTodos: Todo[],
): Todo[] => {
  switch (filter) {
    case FilterType.Active:
      return currentTodos.filter(todo => !todo.completed);
    case FilterType.Completed:
      return currentTodos.filter(todo => todo.completed);
    case FilterType.All:
    default:
      return currentTodos;
  }
};
