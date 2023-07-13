import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const preparedTodos = (todos: Todo[], filter: FilterTypes) => {
  return todos.filter(todo => {
    switch (filter) {
      case FilterTypes.All:
        return true;
      case FilterTypes.Active:
        return !todo.completed;
      case FilterTypes.Completed:
        return todo.completed;
      default:
        throw new Error('wrong filter selected');
    }
  });
};
