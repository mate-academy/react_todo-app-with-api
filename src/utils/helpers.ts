import { Status, Todo } from '../types';

export function filterTodos(todos: Todo[], status: Status) {
  return todos.filter(({ completed }) => {
    switch (status) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      case Status.All:
      default:
        return true;
    }
  });
}
