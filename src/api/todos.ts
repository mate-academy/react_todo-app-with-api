import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (data: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (
  id: number, data: Partial<Omit<Todo, 'id' | 'userId'>>,
) => {
  return client.patch(`/todos/${id}`, data);
};
