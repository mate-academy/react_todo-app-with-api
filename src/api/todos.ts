import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11123;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = ({
  id,
  title,
  userId,
  completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
};

export const deleteTodo = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};
