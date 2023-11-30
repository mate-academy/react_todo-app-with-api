import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, { userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${todoId}`,{ userId, title, completed });
};

// Add more methods here
