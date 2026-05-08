import { Todo } from '../types/Todo';
import { client } from '../../../shared/api/fetchClient';

export const USER_ID = 4196;
export const USER_URL = `/todos?userId=${USER_ID}`;

export const getTodos = () => {
  return client.get<Todo[]>(USER_URL);
};

export function createTodo(data: Omit<Todo, 'id'>): Promise<Todo> {
  return client.post<Todo>('/todos', data);
}

export function removeTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function updateTodo(id: number, data: Partial<Omit<Todo, 'id'>>) {
  return client.patch<Todo>(`/todos/${id}`, data);
}
