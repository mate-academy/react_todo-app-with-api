import { Todo } from '../types/types';
import { client } from '../utils/FetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodo = ({
  id,
  userId,
  title,
  completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    userId,
    title,
    completed,
  });
};
