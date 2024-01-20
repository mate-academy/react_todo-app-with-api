import { Filters, Todo } from '../types';

export const getFilteredItems = (
  todos: Todo[],
  filter: Filters,
): Todo[] => {
  let filteredTodos = [...todos];

  switch (filter) {
    case Filters.Active:
      filteredTodos = todos.filter((todo) => !todo.completed);
      break;

    case Filters.Completed:
      filteredTodos = todos.filter((todo) => todo.completed);
      break;

    default:
      break;
  }

  return filteredTodos;
};
