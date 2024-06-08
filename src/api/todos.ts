import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 751;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addPost = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deletePost = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const completedCheck = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: completed });
};

export const titleChanged = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: title });
};

// Add more methods here
