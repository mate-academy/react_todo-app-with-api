import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (title: string, userId: number, completed: boolean) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const patchTodoCompleted = (userId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${userId}`, { completed });
};

export const patchTodoTitle = (userId: number, title: string) => {
  return client.patch<Todo>(`/todos/${userId}`, { title });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
