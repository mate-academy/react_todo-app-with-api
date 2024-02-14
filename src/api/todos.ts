import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post('/todos/', { userId, title, completed });
};

export const updateTodo = ({
  id, userId, title, completed,
}: Todo) => {
  return client.patch(`/todos/${id}`, { userId, title, completed });
};
