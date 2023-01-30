import { FilterStatus } from '../types/Filterstatus';
import { Todo } from '../types/Todo';

export const filterTodosByCompleted = (
  todos: Todo[],
  filterStatus: FilterStatus,
) => {
  switch (filterStatus) {
    case FilterStatus.Active:
      return todos.filter(todo => !todo.completed);

    case FilterStatus.Completed:
      return todos.filter(todo => todo.completed);

    case FilterStatus.All:
    default:
      return todos;
  }
};

export const getCompletedTodoIds = (todos: Todo[]) => {
  const completedTodos = todos.filter(todo => todo.completed);

  return completedTodos.map(todo => todo.id);
};

export const getActiveTodoIds = (todos: Todo[]) => {
  const activeTodos = todos.filter(todo => !todo.completed);

  return activeTodos.map(todo => todo.id);
};
