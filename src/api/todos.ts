import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1340;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
