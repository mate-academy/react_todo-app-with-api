import { DefaultFilter } from '../types/DefaultFilter';
import { Todo } from '../types/Todo';

export function getVisibleTodos(selectedFilter: DefaultFilter, todos: Todo[]) {
  if (selectedFilter === DefaultFilter.All) {
    return todos;
  }

  if (selectedFilter === DefaultFilter.Active) {
    return todos.filter(todo => todo.completed === false);
  }

  return todos.filter(todo => todo.completed === true);
}
