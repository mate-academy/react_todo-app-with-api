import { FILTERS } from '../types/Filters';
import { Todo } from '../types/Todo';

export function getfilteredTodos(todos: Todo[], filter: string) {
  switch (filter) {
    case FILTERS.active:
      return todos.filter(todo => !todo.completed);
    case FILTERS.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
