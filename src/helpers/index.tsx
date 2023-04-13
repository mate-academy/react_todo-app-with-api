import { Todo } from '../types/Todo';
import { SortTodoBy } from '../types/SortTodoBy';

export const filterTodos = (todos: Todo[], sortBy: SortTodoBy): Todo[] => {
  switch (sortBy) {
    case SortTodoBy.Completed:
      return todos.filter(todo => todo.completed);
    case SortTodoBy.Active:
      return todos.filter(todo => !todo.completed);
    default:
      return todos;
  }
};
