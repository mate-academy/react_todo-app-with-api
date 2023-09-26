import { FilteredBy, Todo } from '../types/types';

export function getFilteredTodos(todos: Todo[], filterBy: FilteredBy) {
  let filteredTodos = [...todos];

  if (filterBy === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  if (filterBy === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  }

  return filteredTodos;
}
