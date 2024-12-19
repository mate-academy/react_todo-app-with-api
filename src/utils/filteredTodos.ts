import { Filters } from '../types/enum/Filters';
import { Todo } from '../types/Todo';

export const filteredTodos = (todos: Todo[], filter: Filters) => {
  const filterTodos = [...todos];

  switch (filter) {
    case Filters.Active:
      return filterTodos.filter(todo => !todo.completed);

    case Filters.Completed:
      return filterTodos.filter(todo => todo.completed);

    case Filters.All:
    default:
      return filterTodos;
  }
};
