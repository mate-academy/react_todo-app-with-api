import { Todo } from '../types/Todo';

export function removeTodoById(todos: Todo[], id: number) {
  return todos.filter(todo => todo.id !== id);
}
