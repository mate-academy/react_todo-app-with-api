import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 771;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};

export const toggleTodo = (id: number, updatedField: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedField);
};
