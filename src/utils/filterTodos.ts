import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export function filterTodo(todo: Todo, currentStatus: string) {
  switch (currentStatus) {
    case FilterType.ACTIVE:
      return !todo.completed;

    case FilterType.COMPLETED:
      return todo.completed;

    default:
      return todo;
  }
}
