import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export function getVisibleTodos(todos: Todo[], query: FilterBy) {
  return todos.filter(todo => {
    switch (query) {
      case FilterBy.Active:
        return !todo.completed;

      case FilterBy.Completed:
        return todo.completed;

      case FilterBy.All:
      default:
        return todo;
    }
  });
}
