import { FilterBy } from './types/FilteredBy';
import { Todo } from './types/Todo';

export function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

export function setSingleOrPluralWordByCount(
  word: string,
  count: number,
): string {
  return count > 1
    ? `${word}s`
    : word;
}

export function filterTodosByCompleted(
  todos: Todo[],
  filterBy: FilterBy,
): Todo[] {
  switch (filterBy) {
    case FilterBy.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case FilterBy.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}
