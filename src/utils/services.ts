import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodos(statusTodo : string, todos : Todo[]) {
  switch (statusTodo) {
    case Status.Active:
      return todos.filter(todo => !todo.completed);
    case Status.Completed:
      return todos.filter(todo => todo.completed);
    case Status.All:
      return todos;
    default:
      return todos;
  }
}
