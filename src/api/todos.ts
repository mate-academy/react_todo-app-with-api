import { Todo } from '../types/Todo';
import { EditField } from '../types/types';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (body: Todo) => {
  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const editTodo = (id: number, body: EditField) => {
  return client.patch<Todo>(`/todos/${id}`, body);
};
