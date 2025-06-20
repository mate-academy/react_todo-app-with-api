import { Todo } from '../types/todo/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3054;

export const TEMP_TODO_ID = 0;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (body: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, body: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, body);
};
