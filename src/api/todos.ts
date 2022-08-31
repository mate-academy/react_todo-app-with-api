import { CreateTodoFragment, Todo, UpdateTodoframent } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const postTodo = (data: CreateTodoFragment) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (todoId: number, data: UpdateTodoframent) => {
  return client.patch(`/todos/${todoId}`, data);
};
