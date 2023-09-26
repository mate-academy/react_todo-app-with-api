import { Todo } from '../types/types';

export const findTodoById = (todos: Todo[], todoId: number | null) => {
  return todos.find(todo => todo.id === todoId) || null;
};
