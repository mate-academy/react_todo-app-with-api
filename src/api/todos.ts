import { Todo } from '../types/Todo';
import { client } from '../fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const editTodo = (id: number, data: any) => {
  return client.patch(`/todos/${id}`, data);
};
