import { FilterParams } from '../types/enums';
import { Todo } from '../types/Todo';

export const activeTodosCount = (todos: Todo[]) =>
  todos.filter(todo => !todo.completed).length;

export const isAllTodosCompleted = (todos: Todo[]): boolean =>
  todos.every(todo => todo.completed);

export function filterTodosByParam(
  todos: Todo[],
  filter: FilterParams,
): Todo[] {
  switch (filter) {
    case FilterParams.Active:
      return todos.filter(todo => !todo.completed);

    case FilterParams.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
}
