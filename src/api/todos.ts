import { Todo } from '../types/todos';
import { client } from '../utils/fetchClient';

export const USER_ID = 3344;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
