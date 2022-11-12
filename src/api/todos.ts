import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const createTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId,
  });
};

export const updateTodo = (url: number, userId: {}) => {
  return client.patch<Todo>(`/todos/${url}`, userId);
};

export const deleteTodo = (url: number) => {
  return client.delete(`/todos/${url}`);
};
