/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../Types/Todo';
import { client } from './FatchClient';

export const getTodos = (id: number) => {
  return client.get(`/todos?userId=${id}`);
};

export const createPost = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post('/todos', { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
