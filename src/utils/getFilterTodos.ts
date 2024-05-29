import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function getFilteredTodos(
  todos: Todo[],
  filter: Status,
): Todo[] {
  switch (filter) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
