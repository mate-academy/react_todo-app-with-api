import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 123;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = async (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: Partial<Todo>): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const createTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};
