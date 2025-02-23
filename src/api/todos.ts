import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11625;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id' | 'isLoading'>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const updateTodo = (todoId: number, data: Pick<Todo, 'completed'>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const editTodo = (todoId: number, data: Pick<Todo, 'title'>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const delTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
