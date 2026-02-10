import { TodoFilters } from '../enums/TodoFilters';
import { Todo } from '../types/Todo';

export function filterTodos(filterState: TodoFilters, todos: Todo[] = []) {
  const filterByState = {
    [TodoFilters.All]: () => true,
    [TodoFilters.Completed]: (todo: Todo) => todo.completed,
    [TodoFilters.Active]: (todo: Todo) => !todo.completed,
  };

  return todos.filter(filterByState[filterState]);
}
