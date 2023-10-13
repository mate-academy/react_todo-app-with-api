import { Todo, TodoStatusFilter } from '../types/Todo';

export function getCompletedTodos(todos: Todo[]) {
  return todos.filter((todo) => todo.completed);
}

export function getActiveTodos(todos: Todo[]) {
  return todos.filter((todo) => !todo.completed);
}

export function getVisibleTodos(todos: Todo[], statusFilter: TodoStatusFilter) {
  return todos.filter((todo) => {
    switch (statusFilter) {
      case TodoStatusFilter.Active:
        return !todo.completed;

      case TodoStatusFilter.Completed:
        return todo.completed;

      default:
        return true;
    }
  });
}
