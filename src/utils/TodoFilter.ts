import { FilterLink } from '../types/FilterLinkTypes';
import { Todo } from '../types/Todo';

export function preparedTodos(
  todos: Todo[],
  option: string,
) {
  if (option) {
    switch (option) {
      case FilterLink.Active: {
        return todos.filter(todo => !todo.completed);
      }

      case FilterLink.Completed: {
        return todos.filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }

  return todos;
}
