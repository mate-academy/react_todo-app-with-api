import { StatusFilter } from './statusFilter';

export interface Todo {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
}

export const getFilteredTodos = (
  todos: Todo[],
  status: StatusFilter,
): Todo[] => {
  switch (status) {
    case StatusFilter.Active:
      return todos.filter(todo => !todo.completed);

    case StatusFilter.Completed:
      return todos.filter(todo => todo.completed);

    case StatusFilter.All:
    default:
      return todos;
  }
};

export const countActiveTodos = (todos: Todo[]): number => {
  return todos.filter(todo => !todo.completed).length;
};

export const hasCompletedTodos = (todos: Todo[]): boolean => {
  return todos.some(todo => todo.completed);
};

export const areAllTodosCompleted = (todos: Todo[]): boolean => {
  return todos.length > 0 && todos.every(todo => todo.completed);
};
