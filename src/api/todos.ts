import {
  Todo, CreateTodoFragment, UpdateStatus, UpdateTitle,
} from '../types/Todo';

import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const createTodo = (newTodo: CreateTodoFragment) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (
  todoId: number, updateData: UpdateStatus | UpdateTitle,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, updateData);
};
