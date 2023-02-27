import { NewTodo, Todo, UpdateData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, newTodo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const updateTodo = (todoId: number, data: UpdateData) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
