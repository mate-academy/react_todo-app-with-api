import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (allTodos: Todo[], filter: Status) => {
  let shownTodos: Todo[] = [];

  switch (filter) {
    case Status.All:
      shownTodos = [...allTodos];
      break;

    case Status.Active:
      shownTodos = allTodos.filter(todo => !todo.completed);
      break;

    case Status.Completed:
      shownTodos = allTodos.filter(todo => todo.completed);
      break;

    default:
      throw new Error('Unknown filter!');
  }

  return shownTodos;
};
