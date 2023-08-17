import { Todo } from './types/Todo';
import { TodoStatusFilter } from './types/TodoStatusFilter';

export const getFilteredTodos = (
  todos: Todo[],
  status: TodoStatusFilter,
): Todo[] => {
  return todos.filter(todo => {
    switch (status) {
      case TodoStatusFilter.Active:
        return !todo.completed;
      case TodoStatusFilter.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
