import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { ChangedTodo } from '../types/ChangedTodo';
import { AddedTodo } from '../types/AddedTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: AddedTodo) => {
  return client.post<Todo>('/todos/', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todoId: number, data: ChangedTodo) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
