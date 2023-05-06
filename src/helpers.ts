import { Todo } from './types/Todo';
import { FilterType } from './typedefs';

export const getFilteredTodos = (
  todos: Todo[],
  filterType: FilterType,
) => {
  return todos.filter(todo => {
    switch (filterType) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });
};
