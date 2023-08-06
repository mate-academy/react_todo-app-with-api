import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: any) => {
  return client.post<Todo[]>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodo = (userId: number, todo: Todo, title?: string) => {
  const requestBody = title ? { title } : { completed: !todo.completed };

  return client.patch(`/todos/${todo.id}?userId=${userId}`, requestBody);
};
