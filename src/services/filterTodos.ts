import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const filteredTodos = (
  todoItems: Todo[],
  filterValues: Status,
): Todo[] => {
  return todoItems.filter((todo: Todo) => {
    switch (filterValues) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
};
