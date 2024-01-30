import { Filters } from '../types';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: Filters) => {
  switch (filterBy) {
    case Filters.Active:
      return todos.filter(({ completed }) => !completed);

    case Filters.Completed:
      return todos.filter(({ completed }) => completed);

    default:
      return todos;
  }
};
