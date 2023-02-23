import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const addTodo = (userId: number, data: any) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const changeTodo = (userId: number, todoId: number, data: any) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, data);
};
