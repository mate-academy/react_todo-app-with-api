import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodoStatus = (
  id: number,
  completed: boolean,
  userId: number,
): Promise<Todo> => {
  return client.patch(`/todos/${id}`, { completed, userId });
};

export const patchTodoTitle = (
  id: number,
  title: string,
  userId: number,
): Promise<Todo> => {
  return client.patch(`/todos/${id}`, { title, userId });
};

// Add more methods here
