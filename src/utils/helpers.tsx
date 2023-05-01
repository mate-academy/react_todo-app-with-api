import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterEnum';

export const filterTodoList = (todos: Todo[], filter: FilterType): Todo[] => {
  return todos.filter(({ completed }) => {
    switch (filter) {
      case FilterType.All:
        return true;

      case FilterType.Active:
        return !completed;

      case FilterType.Completed:
        return completed;

      default:
        return true;
    }
  });
};
