/* eslint-disable prettier/prettier */
import { Todo } from '../types/Todo';
import { TodoFilter } from '../types/TodoFilter';

export const filterTodos = (
  initialTodos: Todo[],
  filter: TodoFilter,
): Todo[] => {
  const filteredTodos = [...initialTodos];

  switch (filter) {
    case TodoFilter.Completed:
      return filteredTodos.filter(todo => todo.completed === true);
    case TodoFilter.Active:
      return filteredTodos.filter(todo => todo.completed === false);
    default:
      return initialTodos;
  }
};
