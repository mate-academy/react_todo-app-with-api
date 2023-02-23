import { Todo } from './types/Todo';
import { FilterStatus } from './types/FilterStatus';
import { ErrorType } from './types/ErrorType';

export function activeTodosAmount(todos: Todo[]): number {
  return todos.filter(todo => !todo.completed).length;
}

export function isDone(todos: Todo[]): boolean {
  return todos.some(todo => todo.completed);
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

export function closeError(
  callback: (val: boolean) => void,
  value: boolean,
  delay: number,
) {
  let timerId;

  window.clearTimeout(timerId);

  timerId = window.setTimeout(() => {
    callback(value);
  }, delay);
}

export function errorMessage(
  errorType: ErrorType,
): string {
  switch (errorType) {
    case ErrorType.Add:
    case ErrorType.Delete:
    case ErrorType.Update:
    case ErrorType.Load:
      return `Unable to ${errorType} a todo`;
      break;
    case ErrorType.EmptyTitle:
      return 'Title can\'t be empty';
      break;
    default:
      return '';
  }
}

export function clearNotification(
  callback: (error: ErrorType) => void,
  delay: number,
) {
  let timerId;

  window.clearTimeout(timerId);

  timerId = window.setTimeout(() => {
    callback(ErrorType.None);
  }, delay);
}
