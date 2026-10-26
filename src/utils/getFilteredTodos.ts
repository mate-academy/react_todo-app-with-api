import { Todo } from '../types/Todo';
import { FILTERS } from './constants';

export const getFilteredTodos = (todos: Todo[], filter: string): Todo[] => {
  switch (filter) {
    case FILTERS.Active:
      return todos.filter(todo => !todo.completed);
    case FILTERS.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
