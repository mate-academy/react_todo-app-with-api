import { Filters } from '../../types/Filters';
import { Todo } from '../../types/Todo';

export const getFilteredTodo = (filterType: Filters, todos: Todo[]) => {
  return todos.filter(todo => {
    switch (filterType) {
      case Filters.Active:
        return !todo.completed;

      case Filters.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
