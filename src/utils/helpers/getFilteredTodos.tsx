import { Todo } from '../../types/Todo';
import { FilterType } from '../../types/FilterType';

export const getFilteredTodos = (allTodos: Todo[], sortField: string) => {
  switch (sortField) {
    case FilterType.Active:
      return allTodos.filter((todo) => !todo.completed);
    case FilterType.Completed:
      return allTodos.filter((todo) => todo.completed);
    case FilterType.All:
    default:
      return allTodos;
  }
};
