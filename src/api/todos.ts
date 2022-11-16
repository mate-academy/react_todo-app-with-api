import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    title,
    completed: false,
  });
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoID: number, data: Partial<Todo>,
) => client.patch<Todo>(`/todos/${todoID}`, data);
