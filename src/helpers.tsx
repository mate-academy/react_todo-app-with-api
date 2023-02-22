import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';

export function activeTodosAmount(todos: Todo[]): number {
  return todos.filter(todo => !todo.completed).length;
}

export function completedTodosAmount(todos: Todo[]): number {
  return todos.filter(todo => todo.completed).length;
}

export function filterTodos(
  todos: Todo[],
  selectedFilter: FilterStatus,
): Todo[] {
  if (selectedFilter === FilterStatus.All) {
    return todos;
  }

  return todos.filter((todo) => {
    switch (selectedFilter) {
      case FilterStatus.Active:
        return !todo.completed;

      case FilterStatus.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}
