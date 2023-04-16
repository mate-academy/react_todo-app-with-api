import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getTodo = (id: number): Promise<Todo> => {
  return client.get<Todo>(`/todos/${id}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export function updateTodo(
  {
    id, title, completed, userId,
  }: Todo,
): Promise<Todo> {
  return client.patch(`/todos/${id}`, { title, completed, userId });
}
