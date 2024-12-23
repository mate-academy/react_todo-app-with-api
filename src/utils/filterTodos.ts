import { FilterType } from '../types/FilterType';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filter: FilterType): Todo[] => {
  switch (filter) {
    case FilterType.All:
      return todos;
    case FilterType.Completed:
      return todos.filter(todo => todo.completed);
    case FilterType.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return [];
  }
};
