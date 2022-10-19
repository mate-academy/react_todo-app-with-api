import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (id: number, data: any) => {
  return client.patch(`/todos/${id}`, data);
};

export const updateTodo = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, { title });
};
