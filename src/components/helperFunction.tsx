import { Filter } from '../types/Filter';
import { Todo } from '../types/Todo';

export const getFilterTodos = (
  todos: Todo[],
  completedFilter: Omit<Filter, 'all'>,
) => {
  return todos.filter(todo => {
    switch (completedFilter) {
      case Filter.completed:
        return todo.completed;

      case Filter.active:
        return !todo.completed;

      default:
        return todo;
    }
  });
};

export const getCompletedTodoIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return completedTodos.map(todo => todo.id);
};
