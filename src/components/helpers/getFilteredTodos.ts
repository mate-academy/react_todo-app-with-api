import { FilterType } from '../../types/FiltersType';
import { Todo } from '../../types/Todo';

export const getFilteredTodos = (
  todos: Todo[],
  completedFilter: FilterType,
) => {
  if (completedFilter === FilterType.All) {
    return todos;
  }

  return todos.filter(todo => (completedFilter === FilterType.Completed
    ? todo.completed
    : !todo.completed
  ));
};
