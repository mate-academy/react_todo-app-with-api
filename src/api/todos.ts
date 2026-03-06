import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3937;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const addTodo = (data: Omit<Todo, 'id'>) =>
  client.post<Todo>('/todos', data);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

export const updateTodo = (todoId: number, data: Partial<Todo>) =>
  client.patch<Todo>(`/todos/${todoId}`, data);
