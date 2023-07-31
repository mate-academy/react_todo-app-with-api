import { Todo } from '../types/Todo';

export const findTodoById = (todos: Todo[], todoId: number | null) => {
  return todos.find(todo => todo.id === todoId) || null;
};
