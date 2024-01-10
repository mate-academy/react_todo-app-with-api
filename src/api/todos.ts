import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  title: string, userId: number, completed: boolean,
): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    title,
    userId,
    completed,
  });
};

export const removeTodo = (todoId: number, userId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const toggleTodo = (
  todoId: number, userId: number, completed: boolean,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${userId}`, {
    completed,
  });
};

export const titleTodo = (
  todoId: number, userId: number, title: string,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${userId}`, {
    title,
  });
};
