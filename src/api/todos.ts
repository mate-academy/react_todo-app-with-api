import {
  CreateTodoFragment, Todo, UpdateStatus, UpdateTitle,
} from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (newTodo: CreateTodoFragment) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (idTodo: number) => {
  return client.delete(`/todos/${idTodo}`);
};

export const patchTodo = (
  idTodo: number, updateData: UpdateStatus | UpdateTitle,
) => {
  return client.patch<Todo>(`/todos/${idTodo}`, updateData);
};
