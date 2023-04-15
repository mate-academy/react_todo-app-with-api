import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const filterTodos = (
  todos: Todo[],
  status: TodoStatus,
): Todo[] => {
  switch (status) {
    case TodoStatus.ACTIVE:
      return todos.filter(todo => !todo.completed);
    case TodoStatus.COMPLETED:
      return todos.filter(todo => todo.completed);
    case TodoStatus.ALL:
    default:
      return todos;
  }
};
