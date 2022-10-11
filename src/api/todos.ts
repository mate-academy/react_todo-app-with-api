import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodos = (todo: {
  userId: number,
  title: string,
  completed: boolean,
}) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, todo: {
  completed: boolean,
}) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};

export const patchTitleTodo = (todoId: number, todo: {
  title: string,
}) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
