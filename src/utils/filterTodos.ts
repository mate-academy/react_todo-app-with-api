import { Sort } from '../types/enums/Sort';
import { Todo } from '../types/Todo';

export function filterTodo(todo: Todo, currentStatus: Sort) {
  switch (currentStatus) {
    case Sort.ACTIVE:
      return !todo.completed;

    case Sort.COMPLETED:
      return todo.completed;

    default:
      return true;
  }
}
