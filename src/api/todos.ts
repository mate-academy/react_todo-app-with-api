import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post('/todos', { title, completed, userId });
};

export const updateTodo = (id: number, updatedTodo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedTodo);
};
