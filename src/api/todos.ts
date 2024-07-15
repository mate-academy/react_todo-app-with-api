import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 883;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = async (id: number) => {
  const response = await client.delete(`/todos/${id}`);

  return response as Response;
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
}

export const patchTodo = (id: number, data: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

// Add more methods here
