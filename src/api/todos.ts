import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  { userId, title, completed }: Omit<Todo, 'id'>,
) :Promise<Todo> => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId :number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, title, completed } :Todo) :Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, { id, title, completed });
};
