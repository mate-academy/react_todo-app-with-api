import { client } from '../utils/fetchClient';
// eslint-disable-next-line import/extensions
import { Todo } from '../types/Todo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, ...data }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
