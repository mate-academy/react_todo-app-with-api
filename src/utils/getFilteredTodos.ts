import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

interface Filters {
  status: Filter;
}

export const getFilteredTodos = (
  todos: Todo[],
  { status }: Filters,
): Todo[] => {
  if (status === Filter.all) {
    return todos;
  }

  return todos.filter(todo =>
    status === Filter.completed ? todo.completed : !todo.completed,
  );
};
