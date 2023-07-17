import { StatusFilter } from '../types/StatusFilter';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterType: StatusFilter) => {
  return todos.filter(todo => {
    switch (filterType) {
      case StatusFilter.active:
        return !todo.completed;

      case StatusFilter.completed:
        return todo.completed;

      default:
        return todo;
    }
  });
};
