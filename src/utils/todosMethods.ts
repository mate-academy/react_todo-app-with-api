import { Todo } from '../types/Todo';
import { apiClient } from './fetchClient';

export const deleteTodo = (todoId: number) => {
  return apiClient.delete(`/todos/${todoId}`);
};

export const getTodos = (userId: number) => {
  return apiClient.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return apiClient.post<Todo>('/todos', { title, completed, userId });
};

export const patchTodoTitle = (todoId: number,
  { title }: Pick<Todo, 'title'>) => {
  return apiClient.patch(`/todos/${todoId}`, { title });
};

export const patchTodoStatus = (todoId: number,
  { completed }: Pick<Todo, 'completed'>) => {
  return apiClient.patch(`/todos/${todoId}`, { completed });
};
