import { CompletedFilter } from '../types/CompletedFilter';
import { Todo } from '../types/Todo';

export const filterTodosByCompleted = (
  todos: Todo[],
  completedFilter: CompletedFilter,
) => {
  if (completedFilter === CompletedFilter.All) {
    return todos;
  }

  return todos.filter((todo) => (CompletedFilter.Completed === completedFilter
    ? todo.completed
    : !todo.completed
  ));
};

export const getCompletedTodoIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return completedTodos.map(todo => todo.id);
};
