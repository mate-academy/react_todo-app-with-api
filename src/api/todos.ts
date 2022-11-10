import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addNewTodo = (data: NewTodo) => {
  return client.post<Todo[]>('/todos', data);
};

export const updateTodo = (data: Todo, userId: number) => {
  return client.patch<Todo>(`/todos/${userId}`, data);
};
