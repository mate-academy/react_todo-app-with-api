import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

// patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, title: string) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  userId: number,
  title: string,
  completed: boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, { userId, title, completed });
};
