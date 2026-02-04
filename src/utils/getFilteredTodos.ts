import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

export function getFilteredTodos(todos: Todo[], filterField: Filters) {
  return todos.filter(todo => {
    switch (filterField) {
      case Filters.Default:
        return todo;

      case Filters.Active:
        return !todo.completed;

      case Filters.Completed:
        return todo.completed;

      default:
        return;
    }
  });
}
