import { FilterType } from '../../types/FilterType';
import { Todo } from '../../types/Todo';

export const getFilterTodos = (todos: Todo[], completedFilter: FilterType) => {
  return todos.filter(todo => {
    switch (completedFilter) {
      case FilterType.Completed:
        return todo.completed;

      case FilterType.Active:
        return !todo.completed;

      default:
        return todo;
    }
  });
};

export const getCompletedTodosIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);
  const completedTodoIds = completedTodos.map(todo => todo.id);

  return completedTodoIds;
};
