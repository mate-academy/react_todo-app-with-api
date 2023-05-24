import { Todo } from '../types/Todo';
import { FilterTodoBy } from '../types/FilterTodoBy';

export const filterTodos = (todos: Todo[], filterBy: FilterTodoBy): Todo[] => {
  switch (filterBy) {
    case FilterTodoBy.Completed:
      return todos.filter(todo => todo.completed);
    case FilterTodoBy.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
