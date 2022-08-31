import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: any) => {
  return client.post<Todo>('/todos/', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todoId: number, data: any) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
