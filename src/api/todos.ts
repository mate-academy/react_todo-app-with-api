import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 296;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const updateTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const toggleUpdateTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};
