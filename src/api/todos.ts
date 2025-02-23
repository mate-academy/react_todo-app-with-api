import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 344;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, changes: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, changes);
};
