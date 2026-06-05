import { Todo } from '../types/Todo';

export const getItemsCounterText = (todos: Todo[]) => {
  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  return `${activeTodosCount} ${activeTodosCount === 1 ? 'item' : 'items'} left`;
};
