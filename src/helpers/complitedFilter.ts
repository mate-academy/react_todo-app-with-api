import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (
  todos: Todo[],
  complitedFilter: FilterType,
) => {
  switch (complitedFilter) {
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);

    case FilterType.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
