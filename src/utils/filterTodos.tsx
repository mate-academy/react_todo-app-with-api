import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function filterTodos(todos: Todo[], statusOfTodos: string) {
  let filteredTodos = todos;

  if (statusOfTodos === Status.active) {
    filteredTodos = filteredTodos.filter(todo => !todo.completed);
  }

  if (statusOfTodos === Status.completed) {
    filteredTodos = filteredTodos.filter(todo => todo.completed);
  }

  return filteredTodos;
}
