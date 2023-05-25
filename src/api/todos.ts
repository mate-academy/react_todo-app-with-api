import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodos = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed });
};

export const changeTitleTodos = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, { title });
};
