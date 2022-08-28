import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  userId: number,
  title: string,
  completed: boolean,
): Promise<Todo> => {
  return client.post('/todos', {
    userId,
    title,
    completed,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = ({ id, ...data }: Todo) => {
  return client.patch(`/todos/${id}`, data);
};
