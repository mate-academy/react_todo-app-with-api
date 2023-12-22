import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (sourceTodos: Todo[], filterBy: FilterType) => {
  let filteredTodos: Todo[];

  switch (filterBy) {
    case FilterType.Active:
      filteredTodos = sourceTodos.filter(todo => !todo.completed);
      break;

    case FilterType.Completed:
      filteredTodos = sourceTodos.filter(todo => todo.completed);
      break;

    default:
      filteredTodos = [...sourceTodos];
  }

  return filteredTodos;
};
