import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

export const filterTodos = (
  todos: Todo[],
  sortBy: FilterType,
): Todo[] => {
  return todos.filter(todo => {
    switch (sortBy) {
      case FilterType.ACTIVE:
        return !todo.completed;

      case FilterType.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });
};
