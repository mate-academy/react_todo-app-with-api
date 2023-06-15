import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: {}) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (userId: number, id: number) => {
  return client.delete(`/todos/${id}?userId=${userId}`);
};

export const updateTodo = (userId: number, id: number, data: {}) => {
  return client.patch<Todo>(`/todos/${id}?userId=${userId}`, data);
};
