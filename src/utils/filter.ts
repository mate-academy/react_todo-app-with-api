import { FilterOption } from '../types/Filter';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], filter: FilterOption): Todo[] {
  switch (filter) {
    case FilterOption.Active:
      return todos.filter(todo => !todo.completed);
    case FilterOption.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
