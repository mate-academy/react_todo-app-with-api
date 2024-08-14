import { TodoStatus } from '../types/TodoStatus';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], status: TodoStatus): Todo[] => {
  switch (status) {
    case TodoStatus.Active:
      return todos.filter(todo => !todo.completed);
    case TodoStatus.Completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
