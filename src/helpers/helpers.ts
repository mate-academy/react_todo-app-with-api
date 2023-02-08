import { FilterTypes } from '../types/FilterTypes';
import { Todo } from '../types/Todo';

export const filterTodos = (
  todos: Todo[],
  filterType: FilterTypes,
) => todos.filter(todo => {
  switch (filterType) {
    case FilterTypes.Active:
      return !todo.completed;
    case FilterTypes.Completed:
      return todo.completed;

    default:
      return todo;
  }
});

export const createUncompletedTodosTitle = (uncompletedTodosAmount: number) => {
  return `${uncompletedTodosAmount} item${uncompletedTodosAmount > 1 ? 's' : ''} left`;
};
