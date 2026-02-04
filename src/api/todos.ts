import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3884;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (todoId: number, editedData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, editedData);
};

export const createTodo = (data: Partial<Todo>) => {
  return client.post<Todo>('/todos', data);
};
