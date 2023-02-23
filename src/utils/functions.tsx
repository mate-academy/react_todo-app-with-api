import { Todo } from '../types/Todo';
import { FilterByStatus } from '../types/FilterByStatus';

export function completedTodosLength(todos: Todo[]): number {
  return todos.filter(todo => todo.completed).length;
}

export function activeTodosLength(todos: Todo[]): number {
  return todos.filter(todo => !todo.completed).length;
}

export function filterTodos(
  todos: Todo[],
  filteredByStatus: FilterByStatus,
): Todo[] {
  if (filteredByStatus === FilterByStatus.All) {
    return todos;
  }

  return todos.filter((todo) => {
    switch (filteredByStatus) {
      case FilterByStatus.Active:
        return !todo.completed;

      case FilterByStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}
