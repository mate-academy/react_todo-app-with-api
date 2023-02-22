import { Todo } from '../types/Todo';
import { Filter } from '../types/Status';

export const todosFilter = (todos: Todo[], filter: Filter) => {
  return todos.filter(todo => {
    switch (filter) {
      case Filter.ALL:
        return true;

      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        throw new Error('Unexpected status');
    }
  });
};
