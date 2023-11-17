import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const completeTodo
= ({ id, completed }: Omit<Todo, 'title' | 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const renameTodo
= ({ id, title }: Omit<Todo, 'completed' | 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
