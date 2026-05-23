import { Todo } from '../types/Todo';

export const getTodosStats = (todos: Todo[]) => {
  const hasTodos = todos.length > 0;
  const completedTodosCount = todos.reduce((count, todo) => {
    return todo.completed ? count + 1 : count;
  }, 0);
  const activeTodosCount = todos.length - completedTodosCount;
  const hasCompletedTodos = completedTodosCount > 0;
  const allTodosCompleted = hasCompletedTodos && activeTodosCount === 0;

  return {
    hasTodos,
    activeTodosCount,
    hasCompletedTodos,
    allTodosCompleted,
  };
};
