import { Filters } from '../types/Filters';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filter: Filters): Todo[] => {
  switch (filter) {
    case Filters.ACTIVE:
      return todos.filter(t => !t.completed);
    case Filters.COMPLETED:
      return todos.filter(t => t.completed);
    case Filters.ALL:
      return todos;
    default:
      return todos;
  }
};
