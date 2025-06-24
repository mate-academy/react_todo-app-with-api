import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function getPreparedTodos(todos: Todo[], filter: FilterType): Todo[] {
  return todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      case FilterType.All:
      default:
        return true;
    }
  });
}
