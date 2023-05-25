import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoOnServer = (todoData: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos/', todoData);
};

export const deleteTodoFromServer = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoOnServer = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
