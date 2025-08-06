import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1008;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'editted' | 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (idNumber: number) => {
  return client.delete(`/todos/${idNumber}`);
};

export const updateTodo = (id: number, changes: Partial<Todo>) => {
  return client.patch<Todo[]>(`/todos/${id}`, changes);
};
