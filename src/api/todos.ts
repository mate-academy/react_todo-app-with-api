import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todoData: TodoData) => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateStatusTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTitleTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
