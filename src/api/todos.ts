import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4058;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const updateTodo = (id: number, title: string, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, {
    userId: USER_ID,
    title,
    completed,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
