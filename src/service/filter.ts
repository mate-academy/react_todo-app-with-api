import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getVisibleTodos = (todos: Todo[], filted: Filter) => {
  switch (filted) {
    case Filter.ACTIVE:
      return todos.filter(todo => !todo.completed);

    case Filter.COMPLETED:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
