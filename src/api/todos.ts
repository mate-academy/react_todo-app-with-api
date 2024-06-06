/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 698;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete<Todo>(`/todos/${id}`);
};

export const updateTodo = (data: any, id: number) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

// Add more methods here
