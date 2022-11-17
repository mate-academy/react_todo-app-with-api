import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (title: string, userId: number) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    userId,
    title,
    completed: false,
  });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const renameTodo = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
  });
};

export const updateStatusTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed: !completed,
  });
};
