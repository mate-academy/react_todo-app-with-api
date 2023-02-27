import { FilterTypes } from '../types/FIlterTypes';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterType: FilterTypes) => {
  let filteredTodos = todos;

  switch (filterType) {
    case FilterTypes.Active:
      filteredTodos = filteredTodos.filter(todo => !todo.completed);
      break;

    case FilterTypes.Completed:
      filteredTodos = filteredTodos.filter(todo => todo.completed);
      break;

    case FilterTypes.All:
    default:
      filteredTodos = todos;
  }

  return filteredTodos;
};
