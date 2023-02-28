import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';

import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const saveTodo = (userId: number, data: TodoData) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const updateTodo = (id: number, data: TodoData) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const removeTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
