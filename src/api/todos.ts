import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, title: string, completed: boolean) => {
  return client.post<Todo[]>(`/todos?userId=${userId}`, {
    title,
    completed,
  });
};

export const editTodos = (
  userId: number, title: string, completed: boolean,
) => {
  return client.patch<Todo[]>(`/todos?userId=${userId}`, {
    title,
    completed,
  });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/todoId=${todoId}`);
};
