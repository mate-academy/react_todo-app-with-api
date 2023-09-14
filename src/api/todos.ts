import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, data: any) => {
  return client.post<Todo[]>(`/todos?userId=${userId}`, data);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (todoId: number, data: any) => {
  return client.patch(`/todos/${todoId}`, data);
};
