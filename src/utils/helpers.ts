import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const filterTodos = (
  todos: Todo[],
  status: TodoStatus,
): Todo[] => {
  let visibleTodos;

  switch (status) {
    case TodoStatus.ACTIVE:
      visibleTodos = todos.filter(todo => !todo.completed);
      break;
    case TodoStatus.COMPLETED:
      visibleTodos = todos.filter(todo => todo.completed);
      break;
    case TodoStatus.ALL:
    default:
      visibleTodos = todos;
      break;
  }

  return visibleTodos;
};
