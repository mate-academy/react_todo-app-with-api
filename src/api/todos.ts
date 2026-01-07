import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3805;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodo = (id: number, data: { title: string }) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
