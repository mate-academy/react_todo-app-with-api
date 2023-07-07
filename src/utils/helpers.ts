import { Todo } from '../types/Todo';
import { TodoStatusFilter } from '../types/TodoStatusFilter';

export function validateTitle(title: string): void {
  if (!title.trim()) {
    throw new Error('Title can\'t be empty');
  }
}

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
