import { Status } from '../types/Status';
import { Todo } from '../types/Todo';

export function getFilteredTodos(todosList: Todo[], filterBy: Status) {
  if (filterBy === Status.Active) {
    return todosList.filter((todo: Todo) => !todo.completed);
  }

  if (filterBy === Status.Completed) {
    return todosList.filter((todo: Todo) => todo.completed);
  }

  return todosList;
}
