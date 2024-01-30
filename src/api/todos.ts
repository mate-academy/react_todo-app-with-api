import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ userId, title, completed }:
Omit<Todo, 'id' | 'loading'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id, userId, title, completed,
}: Omit<Todo, 'loading'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};
