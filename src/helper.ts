import { Status } from './types/Status';
import { Todo } from './types/Todo';

export const filterTodos = (
  todos: Todo[],
  filterStatus: Status,
  query?: string,
) => {
  let todosCopy = [...todos];

  if (query) {
    todosCopy = todosCopy
      .filter(todo => todo.title.toLowerCase().includes(query.toLowerCase()));
  }

  switch (filterStatus) {
    case Status.Active:
      return todosCopy.filter(todo => !todo.completed);

    case Status.Completed:
      return todosCopy.filter(todo => todo.completed);

    default:
      return todosCopy;
  }
};
