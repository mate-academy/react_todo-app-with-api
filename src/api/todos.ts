import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const API_URL = 'https://mate.academy/students-api/todos?userId=11570';
export const USER_ID = 11570;

export const addTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (data: Todo) => {
  return client.patch<Todo>(`/todos/${data.id}`, data);
};
