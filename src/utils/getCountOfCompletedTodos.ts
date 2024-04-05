import { Todo } from '../types/Todo';

export function getCountOfCompletedTodos(todos: Todo[]): number {
  const countOfActiveTodos = todos.filter(todo => todo.completed);

  return countOfActiveTodos.length;
}
