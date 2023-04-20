import { SortType } from '../../types/SortType';
import { Todo } from '../../types/Todo';

export const filterTodos = (
  todos: Todo[],
  sortBy: SortType,
): Todo[] => {
  return todos.filter(todo => {
    switch (sortBy) {
      case SortType.ACTIVE:
        return !todo.completed;

      case SortType.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });
};
