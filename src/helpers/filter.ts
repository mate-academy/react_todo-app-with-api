import { FilteredBy } from '../types/filteredBy';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filteredBy: FilteredBy) => {
  if (filteredBy === FilteredBy.ALL) {
    return todos;
  }

  switch (filteredBy) {
    case FilteredBy.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case FilteredBy.COMPLETED:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
