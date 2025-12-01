import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';

export const getVisibleTodos = (todos: Todo[], filter: Filter) => {
  switch (filter) {
    case Filter.Active:
      return todos.filter(t => !t.completed);
    case Filter.Completed:
      return todos.filter(t => t.completed);
    default:
      return todos;
  }
};
