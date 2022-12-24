import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodos = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const renameTodo = (todoId: number, data: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const toggleTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed,
  });
};
