import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodos(todosList: Todo[], filterBy: Status) {
  return todosList.filter(todo => {
    switch (filterBy) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return todo;
    }
  });
}
