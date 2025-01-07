import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 687;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodos(postId: number) {
  return client.delete(`/todos/${postId}`);
}

export function createTodos({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, userId, completed });
}

export function updateTodos({ id, title, userId, completed }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
}
