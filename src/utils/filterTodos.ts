import { Todo } from '../types/Todo';
import { Filters } from '../types/Filters';

export function filterTodos(filter: Filters, todos: Todo[]) {
  switch (filter) {
    case Filters.All:
      return todos;

    case Filters.ACTIVE:
      return todos.filter((todo: Todo) => !todo.completed);

    case Filters.COMPLETED:
      return todos.filter((todo: Todo) => todo.completed);

    default:
      return todos;
  }
}
