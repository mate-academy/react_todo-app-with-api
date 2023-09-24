import { TodoType } from '../types/TodoType';
import { client } from '../utlis/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({
  userId,
  title,
  completed,
}: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', { userId, title, completed });
};

export const updateTodo = ({ id, ...rest }:
Partial<TodoType>) => {
  return client.patch<TodoType>(`/todos/${id}`, { ...rest });
};
