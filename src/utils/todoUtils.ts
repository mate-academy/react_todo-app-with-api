import { Todo } from '../types/Todo';
import { Status } from '../types/TodoStatusFilter';

export const getFilteredTodos = (todos: Todo[], status: Status) => {
  let filteredTodos = [...todos];

  if (status !== Status.ALL) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (status) {
        case Status.COMPLETED:
          return todo.completed;
        case Status.ACTIVE:
          return !todo.completed;
        default:
          throw new Error('Missing case in getFilteredTodos');
      }
    });
  }

  return filteredTodos;
};
