import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId?: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const pushTodo = (
  title: string,
  userId?: number,
) => {
  return client.post<Todo>(`/todos?userId=${userId}`, {
    createdAt: new Date(),
    userId,
    completed: false,
    title,
  });
};

export const changeCompleteTodo = (
  id: number,
  completed: boolean,
) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const changeTitleTodo = (
  id: number,
  title: string,
) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
