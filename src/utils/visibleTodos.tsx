import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

type UtilsFunction = (arrayOfTodos: Todo[],
  filterBy: FilterBy) => Todo[];

export const getVisibleTodos: UtilsFunction = (arrayOfTodos, filterBy) => {
  return arrayOfTodos.filter((todo: Todo) => {
    switch (filterBy) {
      case FilterBy.active:
        return !todo.completed;

      case FilterBy.completed:
        return todo.completed;

      default:
        return arrayOfTodos;
    }
  });
};
