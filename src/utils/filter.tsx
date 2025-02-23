import { Todo } from '../types/Todo';
import { TodoStatus } from '../types/TodoStatus';

export const filterFunction = (todos: Todo[], chosenFilter: TodoStatus) => {
  switch (chosenFilter) {
    case TodoStatus.active:
      return todos.filter(todo => !todo.completed);
    case TodoStatus.completed:
      return todos.filter(todo => todo.completed);
    default:
      return todos;
  }
};
