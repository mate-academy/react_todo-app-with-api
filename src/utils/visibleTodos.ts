import { Filtering } from '../types/Filtering';
import { Todo } from '../types/Todo';

export const visibleTodos = (currentFiltering: Filtering, todos: Todo[]) => {
  switch (currentFiltering) {
    case Filtering.All:
      return todos;
    case Filtering.Active:
      return todos.filter((todo) => !todo.completed);
    case Filtering.Completed:
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};
