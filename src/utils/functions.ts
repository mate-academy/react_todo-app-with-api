import { FilterStatus, Todo } from '../types/Types';

export const getIsAllTodosCompleted = (todos: Todo[]) => {
  return todos.length > 0 && todos.every(todo => todo.completed);
};

export const getHasCompletedTodos = (todos: Todo[]) => {
  return todos.some(todo => todo.completed);
};

export const getCompletedTodos = (todos: Todo[]) => {
  return todos.filter(todo => todo.completed);
};

export const getActiveTodosCount = (todos: Todo[]) => {
  return todos.filter(todo => !todo.completed).length;
};

export const getFilteredTodos = (todos: Todo[], filter: FilterStatus) => {
  switch (filter) {
    case 'active':
      return todos.filter(todo => !todo.completed);

    case 'completed':
      return todos.filter(todo => todo.completed);

    default:
      return todos;
  }
};

export const getTodosToToggle = (todos: Todo[], isAllCompleted: boolean) => {
  return isAllCompleted ? todos : todos.filter(todo => !todo.completed);
};
