import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2984;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (title: string) => {
  return client.post(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodos = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, {
    completed,
  });
};

export const updateTitle = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, {
    title,
  });
};
