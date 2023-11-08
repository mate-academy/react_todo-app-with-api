import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const postTodos = (
  {
    userId,
    title,
    completed,
  }: Omit<TodoType, 'id'>,
) => {
  return client.post<TodoType>('/todos', { userId, title, completed });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodos = ({
  id,
  completed,
  userId,
  title,
}: TodoType) => {
  return client.patch(`/todos/${id}`, { userId, title, completed });
};
