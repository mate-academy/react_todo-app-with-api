import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export function getTodos(userId: number): Promise<Todo[]> {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
}

export function createTodo(userId: number, title: string): Promise<Todo> {
  return client.post<Todo>('/todos', { userId, title, completed: false });
}

export function deleteTodo(todoId: number): Promise<unknown> {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodo(todoId: number, data: Partial<Todo>): Promise<Todo> {
  return client.patch<Todo>(`/todos/${todoId}`, data);
}
