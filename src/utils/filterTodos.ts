import { FilterType } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export function filterTodos(
  todos: Todo[],
  filterBy: FilterType,
): Todo[] {
  let visibleTodos = [...todos];

  switch (filterBy) {
    case FilterType.ACTIVE:
      visibleTodos = visibleTodos.filter(todo => !todo.completed);
      break;

    case FilterType.COMPLETED:
      visibleTodos = visibleTodos.filter(todo => todo.completed);
      break;

    case FilterType.ALL:
    default:
      break;
  }

  return visibleTodos;
}
