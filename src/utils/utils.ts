import { FilterTodosBy } from '../types/FilterTodosBy';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: FilterTodosBy) => {
  return todos.filter(todo => {
    switch (filterBy) {
      case FilterTodosBy.Active:
        return !todo.completed;
      case FilterTodosBy.Completed:
        return todo.completed;
      default:
        return true;
    }
  });
};
