import { CompletedFilter } from '../types/CompletedFilter';
import { Todo } from '../types/Todo';

export const filteredTodos = (
  todos: Todo[],
  completedFilter: CompletedFilter,
) => {
  return todos.filter(todo => {
    switch (completedFilter) {
      case CompletedFilter.Active:
        return !todo.completed;

      case CompletedFilter.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
};
