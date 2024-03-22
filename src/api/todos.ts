import { AddingTodo, ChangeTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 243;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: AddingTodo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: ChangeTodo) => {
  return client.patch(`/todos/${id}`, data);
};
