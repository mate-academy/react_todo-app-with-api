import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export function getVisibleTodos(todos: Todo[], currentFilter: string) {
  let visibleTodos = todos;

  if (currentFilter !== Filter.All) {
    visibleTodos = todos.filter(({ completed }) => {
      switch (currentFilter) {
        case Filter.Active:
          return !completed;
        case Filter.Completed:
          return completed;
        default:
          return true;
      }
    });
  }

  return visibleTodos;
}
