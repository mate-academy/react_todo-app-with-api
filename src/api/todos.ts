import { NewTodo, Todo, UpdateTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, data: NewTodo) => {
  return client.post<number | Todo[]>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todoId: number | number[]) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: UpdateTodo) => {
  return client.patch<number | Todo[]>(`/todos/${todoId}`, data);
};
