import { Todo } from '../types/Todo';
import { client } from './httpClient';

export function getTodo(userId: number) {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post('/todos', { title, completed, userId });
}

export function updateTodo(todoId: number, data: unknown) {
  return client.patch<Todo>(`/todos/${todoId}`, data);
}
