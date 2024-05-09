import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const USER_ID = 568;

export const getTodos = () => {
  return client.get<TodoType[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<TodoType>) => {
  return client.patch<TodoType>(`/todos/${id}`, data);
};
