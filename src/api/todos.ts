import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (
  userId: number,
  title: string,
) => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoCompleted = (
  id: number,
  completed: boolean,
) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodoTitle = (
  id: number,
  title: string,
) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
  });
};
