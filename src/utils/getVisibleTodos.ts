import { Todo } from '../types/Todo';
import { FilterType } from '../types/FilterType';

export const getVisibleTodos = (todos: Todo[], filter: FilterType) => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);

    case 'completed':
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
