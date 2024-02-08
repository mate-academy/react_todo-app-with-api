import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post('/todos', { title, completed, userId });
};

export const editTodo = (
  { id, title, completed }: Omit<Todo, 'userId'>,
) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
