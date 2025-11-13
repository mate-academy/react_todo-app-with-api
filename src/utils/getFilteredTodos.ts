import { TodoFilter } from '../types/filters';
import { Todo } from '../types/todo';

export const getFilteredTodos = (todos: Todo[], filter: TodoFilter): Todo[] => {
  switch (filter) {
    case TodoFilter.Active:
      return todos.filter(todo => !todo.completed);

    case TodoFilter.Completed:
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};
