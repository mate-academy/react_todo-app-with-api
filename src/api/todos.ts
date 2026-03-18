import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4086;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, updatedData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedData);
};

// Add more methods here
