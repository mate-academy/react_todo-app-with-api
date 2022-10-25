import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const patchTodo = (
  userId: number, data: Partial<Todo>,
) => {
  return client.patch(`/todos/${userId}`, { ...data });
};
