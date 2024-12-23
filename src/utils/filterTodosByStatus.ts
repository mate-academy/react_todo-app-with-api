import { Todo } from '../types/Todo';

export function filterTodosByStatus(
  todos: Todo[],
  completedStatus: boolean | null = null,
) {
  if (completedStatus === null) {
    return todos;
  }

  return todos.filter(todo => todo.completed === completedStatus);
}
