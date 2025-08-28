// File: src/api/todos.ts
import { client } from './client';

export type Todo = {
  id: number;
  userId: number;
  title: string;
  completed: boolean;
};

export const USER_ID = 3430;

export function getTodos(userId: number): Promise<Todo[]> {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
}

export function createTodo(
  userId: number,
  data: { title: string; completed: boolean },
): Promise<Todo> {
  return client.post<Todo>('/todos', { ...data, userId });
}

export function deleteTodo(id: number): Promise<void> {
  return client.delete(`/todos/${id}`);
}

export function updateTodo(
  userId: number,
  id: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> {
  return client.patch<Todo>(`/todos/${id}`, { ...data, userId });
}
