import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoData } from '../types/TodoData';
import { TodoUpdateData } from '../types/TodoUpdateData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: TodoData) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: TodoUpdateData) => {
  return client.patch(`/todos/${id}`, data);
};
