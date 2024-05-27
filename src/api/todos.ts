import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 656;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, updatedField: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedField);
};
