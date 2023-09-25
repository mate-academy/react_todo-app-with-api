import { Todo } from '../types/Todo';
import { FilterType } from '../types/TodoStatus';

export const filterBy = (todos: Todo[], type: FilterType) => {
  return todos.filter(({ completed }) => {
    switch (type) {
      case FilterType.Active: {
        return !completed;
      }

      case FilterType.Completed: {
        return completed;
      }

      case FilterType.All:
      default: {
        return true;
      }
    }
  });
};
