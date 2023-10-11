import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ userId, title, completed }: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', { userId, title, completed });
};

export const updateTodo = (todoId: number, data:
{ title?: string, completed?: boolean }) => {
  return client.patch<TodoType>(`/todos/${todoId}`, data);
};

// Add more methods here
