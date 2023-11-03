import { Todo } from '../types/Todo';
import { ForComletedTodo } from '../types/enumFilter';

export const filterTodos = (
  todos: Todo[], condition: ForComletedTodo,
): Todo[] => {
  return todos.filter(({ completed }) => {
    switch (condition) {
      case ForComletedTodo.Active:
        return !completed;
      case ForComletedTodo.Completed:
        return completed;
      default:
        return 1;
    }
  });
};
