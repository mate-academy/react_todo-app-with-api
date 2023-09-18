import { ITodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<ITodo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<ITodo, 'id'>) => {
  return client.post<ITodo>('/todos', { userId, title, completed });
};

export const updateTodo = ({ id, ...rest }:
Partial<ITodo>) => {
  return client.patch<ITodo>(`/todos/${id}`, { ...rest });
};
