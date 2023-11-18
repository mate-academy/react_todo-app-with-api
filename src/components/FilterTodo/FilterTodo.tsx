import { FilterOptions } from '../../types/Filter';
import { Todo } from '../../types/Todo';

export function getPrepareTodos(
  todos: Todo[],
  filterType: FilterOptions,
): Todo[] {
  let preparedTodos = [...todos];

  switch (filterType) {
    case FilterOptions.All:
      break;

    case FilterOptions.Active:
      preparedTodos = preparedTodos.filter(todo => !todo.completed);
      break;

    case FilterOptions.Completed:
      preparedTodos = preparedTodos.filter(todo => todo.completed);
      break;

    default:
      return preparedTodos;
  }

  return preparedTodos;
}
