import { Todo } from '../types/Todo';
import { SortType } from '../types/SortType';

export const getVisibleTodos = (todos: Todo[], filterType: SortType) => (
  todos.filter(({ completed }) => {
    switch (filterType) {
      case SortType.ALL:
        return true;
      case SortType.ACTIVE:
        return !completed;
      case SortType.COMPLETE:
        return completed;
      default:
        throw new Error('Incorrect sort type');
    }
  })
);
