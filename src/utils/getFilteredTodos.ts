import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filterBy: FilterBy) => {
  let filteredTodos = [...todos];

  switch (filterBy) {
    case FilterBy.Active:
      filteredTodos = todos.filter(todo => !todo.completed);
      break;
    case FilterBy.Complited:
      filteredTodos = todos.filter(todo => todo.completed);
      break;
    case FilterBy.All:
    default:
      filteredTodos = todos;
  }

  return filteredTodos;
};
