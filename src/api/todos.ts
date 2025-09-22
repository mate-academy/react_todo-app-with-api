import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1384;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const editTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const clearCompleted = (ids: number[]) => {
  return Promise.all(ids.map(id => deleteTodo(id)));
};
