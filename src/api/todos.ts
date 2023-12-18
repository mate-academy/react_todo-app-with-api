import { TodoInterface } from '../types/TodoInterface';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoInterface[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  { userId, title, completed }: Omit<TodoInterface, 'id'>,
) => {
  return client.post<TodoInterface>(`/todos?userId=${userId}`, { userId, title, completed });
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const updateTodo = ({
  id, userId, title, completed,
}: TodoInterface) => {
  return client.patch<TodoInterface>(`/todos/${id}`, { userId, title, completed });
};
