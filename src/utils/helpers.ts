import { Todo } from '../types/Todo';
import { TodoFilterStatus } from '../types/TodoFilterStatus';

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

export function getVisibleTodos(todos: Todo[], filterStatus: TodoFilterStatus) {
  return todos.filter((todo) => {
    let status: boolean;

    switch (filterStatus) {
      case TodoFilterStatus.Active:
        status = !todo.completed;
        break;

      case TodoFilterStatus.Completed:
        status = todo.completed;
        break;

      default:
        status = true;
    }

    return status;
  });
}
