import { FilterType } from '../types/FilterTodos';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filter: FilterType) {
  return todos.filter(todo => {
    switch (filter) {
      case FilterType.Active:
        return !todo.completed;
      case FilterType.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
}
