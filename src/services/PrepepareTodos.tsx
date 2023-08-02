import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export function getPreparedTodos(
  todoList: Todo[],
  filter: Filter,
) {
  switch (filter) {
    case Filter.Active:
      return todoList.filter(todo => !todo.completed);

    case Filter.Completed:
      return todoList.filter(todo => todo.completed);

    default:
      return todoList;
  }
}
