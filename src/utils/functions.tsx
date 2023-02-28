import { Todo } from '../types/Todo';
import { FilterByStatus } from '../types/FilterByStatus';
import { ErrorTypes } from '../types/PossibleError';

export function isCompleted(todos: Todo[]): boolean {
  return todos.some(todo => todo.completed);
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

export function closeError(
  callback: (val:boolean) => void,
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
  possibleError: ErrorTypes,
): string {
  switch (possibleError) {
    case ErrorTypes.Add:
    case ErrorTypes.Delete:
    case ErrorTypes.Update:
    case ErrorTypes.Download:
      return `Unable to ${possibleError} a todo`;
      break;
    case ErrorTypes.EmptyTitle:
      return 'Title can`t be empty';
      break;
    default:
      return '';
  }
}

export function clearNotification(
  callback: (error: ErrorTypes) => void,
  delay: number,
) {
  let timerId;

  window.clearTimeout(timerId);

  timerId = window.setTimeout(() => {
    callback(ErrorTypes.None);
  }, delay);
}
