import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (
  title: string,
  userId: number | undefined,
  completed: boolean,
) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todoId: number, data: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
