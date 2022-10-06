import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, title: string):Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId,
    completed: false,
    title,
  });
};

export const removeTodo = (todoID: number):Promise<unknown> => {
  return client.delete(`/todos/${todoID}`);
};

export const updateTodo = (
  todoID: number,
  data: Partial<Todo>,
):Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoID}`, data);
};
