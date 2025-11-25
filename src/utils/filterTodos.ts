import { Todo } from '../types/Todo';
import { FilterTupes } from '../types/Filters';

export const filterTodos = (todos: Todo[], filter: FilterTupes): Todo[] => {
  switch (filter) {
    case FilterTupes.Active:
      return todos.filter(todo => !todo.completed);

    case FilterTupes.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
