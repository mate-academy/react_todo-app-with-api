import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterStatus: Status): Todo[] => {
  let filteredTodos: Todo[] = [];

  switch (filterStatus) {
    case Status.All: {
      filteredTodos = todos;
      break;
    }

    case Status.Active: {
      filteredTodos = todos.filter(todo => todo.completed === false);

      break;
    }

    case Status.Completed: {
      filteredTodos = todos.filter(todo => todo.completed === true);

      break;
    }

    default: filteredTodos = todos;
  }

  return filteredTodos;
};

export function getItemsLeftCountMessage(activeTodos: Todo[]) {
  switch (activeTodos.length) {
    case 1:
      return '1 items left';

    case 0:
      return 'Everything is done';

    default:
      return `${activeTodos.length} items left`;
  }
}
