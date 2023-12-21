import { Todo } from './types/Todo';

export enum FilteredBy {
  All = 'all',
  Active = 'active',
  Completed = 'completed',
}

export function filteredTodoList(
  todos: Todo[],
  filterBy: FilteredBy,
) {
  const filteredTodos = [...todos];

  switch (filterBy) {
    case FilteredBy.Active:
      return filteredTodos.filter(todo => !todo.completed);
    case FilteredBy.Completed:
      return filteredTodos.filter(todo => todo.completed);
    case FilteredBy.All:
    default:
      return filteredTodos;
  }
}
