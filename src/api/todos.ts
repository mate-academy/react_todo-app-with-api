import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1870;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { ...newTodo, userId: USER_ID });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, updatedData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedData);
};
