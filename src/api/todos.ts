import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export type CustomTodo = {
  userId: number;
  title: string;
  completed: boolean;
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: CustomTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: object) => {
  return client.patch(`/todos/${id}`, data);
};

// Add more methods here
