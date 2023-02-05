import { Todo } from '../types';
import { client } from '../utils';

export const USER_ID = 5554;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${USER_ID}`);
};

export const updateTodo = (todoId: number, fieldsToUpdate: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${USER_ID}`, fieldsToUpdate);
};
