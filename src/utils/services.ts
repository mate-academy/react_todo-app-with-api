import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodos(statusTodo : Status, todos : Todo[]) {
  switch (statusTodo) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
}
