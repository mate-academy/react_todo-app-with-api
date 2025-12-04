import { FILTERS, FilterType } from '../constants/filters';
import { Todo } from '../types/Todo';

export const getFilteredTodos = (todos: Todo[], filter: FilterType) => {
  switch (filter) {
    case FILTERS.active:
      return todos.filter(todo => !todo.completed);
    case FILTERS.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
