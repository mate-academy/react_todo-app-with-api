import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', { userId, title, completed: false });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
// Add more methods here
