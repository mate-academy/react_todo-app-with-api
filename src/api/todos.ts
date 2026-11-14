import type { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4585;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number): Promise<unknown> => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
