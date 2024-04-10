import { FilterBy } from '../enums/FilterBy';
import { Todo } from '../types/Todo';

export const handleFilteredTodos = (
  todosFromServer: Todo[],
  filter: FilterBy,
) => {
  if (filter === FilterBy.Active) {
    return todosFromServer.filter(todo => !todo.completed);
  }

  if (filter === FilterBy.Completed) {
    return todosFromServer.filter(todo => todo.completed);
  }

  return todosFromServer;
};
