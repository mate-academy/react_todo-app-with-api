import { Todo, UpdatingTodo } from '../types/Types';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodo = (todoId: number, data: UpdatingTodo) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const USER_ID = 10881;
