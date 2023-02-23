import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6392;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  propsToUpdate: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${USER_ID}`, propsToUpdate);
};
