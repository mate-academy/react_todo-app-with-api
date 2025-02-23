import { FilterBy } from '../types/FilterBy';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: FilterBy): Todo[] => {
  return todos.filter((todo: Todo) => {
    switch (filterBy) {
      case FilterBy.Active:
        return !todo.completed;
      case FilterBy.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
