import { StatusFilter } from '../types/StatusFilter';
import { Todo } from '../types/Todo';

export function getFilterTodos(
  todos: Todo[],
  statusFilter: StatusFilter,
): Todo[] {
  let filteredTodos: Todo[] = [];

  switch (statusFilter) {
    case StatusFilter.All: {
      filteredTodos = todos;
      break;
    }

    case StatusFilter.Active: {
      filteredTodos = todos.filter(todo => todo.completed === false);
      break;
    }

    case StatusFilter.Completed: {
      filteredTodos = todos.filter(todo => todo.completed === true);
      break;
    }

    default: filteredTodos = todos;
  }

  return filteredTodos;
}
