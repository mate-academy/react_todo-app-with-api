import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export function deleteUserTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function updateTodo({ id, title, completed }: Todo) {
  return client.patch<Todo>(`/posts/${id}`, { id, title, completed });
}
// Add more methods here
