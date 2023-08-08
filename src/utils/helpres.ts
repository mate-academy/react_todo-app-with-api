import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (
  filter: TodoStatus,
  todos: Todo[],
  completedTodos: Todo[],
  activeTodos: Todo[],
) => {
  switch (filter) {
    case TodoStatus.COMPLETED:
      return completedTodos;

    case TodoStatus.ACTIVE:
      return activeTodos;

    default:
      return todos;
  }
};
