import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filterField: FilterType) {
  let filteredTodos = todos;

  if (filterField !== FilterType.All) {
    switch (filterField) {
      case FilterType.Completed: {
        filteredTodos = filteredTodos.filter(todo => todo.completed);
        break;
      }

      case FilterType.Active: {
        filteredTodos = filteredTodos.filter(todo => !todo.completed);
        break;
      }

      default:
        throw new Error('Unable to filter todos');
    }
  }

  return filteredTodos;
}
