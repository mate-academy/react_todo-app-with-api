import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export const filterTodos = (todos: Todo[], filterBy: Status): Todo[] => {
  const filteredTodos = [...todos];

  switch (filterBy) {
    case Status.Active:
      return filteredTodos.filter(todo => !todo.completed);
    case Status.Completed:
      return filteredTodos.filter(todo => todo.completed);
    case Status.All:
    default:
      return filteredTodos;
  }
};
