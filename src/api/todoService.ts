import { Todo } from '../types';
import { client } from '../utils';

export const USER_ID = 11530;

export const getTodos = (userId: number = USER_ID) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (title: string, userId: number = USER_ID) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed: !completed,
  });
};

export const editTodo = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
  });
};
