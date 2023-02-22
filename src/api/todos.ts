import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { RequestTodo } from '../types/RequestTodo';
import { RequestCompletion } from '../types/RequestCompletion';
import { RequestUpdateTodo } from '../types/RequestUpdateTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  userId: number,
  data: RequestTodo,
) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoCompletion = (
  todoId: number,
  data: RequestCompletion,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const updateTodo = (
  todoId: number,
  data: RequestUpdateTodo,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
