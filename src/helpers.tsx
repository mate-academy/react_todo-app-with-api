import { StatusFilter } from './types/StatusFilter';
import { Todo } from './types/Todo';

export const filteredTodos = (todos: Todo[], filterType: StatusFilter) => {
  return todos.filter(todo => {
    switch (filterType) {
      case StatusFilter.ACTIVE:
        return !todo.completed;

      case StatusFilter.COMPLETED:
        return todo.completed;

      case StatusFilter.ALL:
        return todo;

      default:
        return todos;
    }
  });
};
