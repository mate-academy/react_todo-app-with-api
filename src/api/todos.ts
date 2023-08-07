import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post('/todos', { title, userId, completed });
};

export const updateTodo = ({
  id, title, userId, completed,
}: Todo) => {
  return client.patch(`/todos/${id}`, {
    id, title, userId, completed,
  });
};
