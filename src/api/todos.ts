import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodo = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({
  userId,
  title,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({ completed, id, title }: Omit<Todo, 'userId'>) => {
  return client.patch(`/todos/${id}`, { completed, title });
};
