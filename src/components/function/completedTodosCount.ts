import { Todo } from '../../types/Todo';

export const completedTodosCount = (todos: Todo[] | null) => {
  return todos ? todos.filter(todo => todo.completed).length : 0;
};
