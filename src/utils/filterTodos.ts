import { Filter } from '../types/enum';
import { Todo } from '../types/interfaces';

export const filterTodos = (todos: Todo[], filter: Filter) => {
  return todos.filter((todo) => {
    switch (filter) {
      case Filter.Active:
        return !todo.completed;

      case Filter.Completed:
        return todo.completed;

      case Filter.All:
      default:
        return true;
    }
  });
};
