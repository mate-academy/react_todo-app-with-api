import { Todo, NewTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createNewTodo = (todo: NewTodo) => {
  return client.post<NewTodo>('/todos', todo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: {}) => {
  return client.patch(`/todos/${id}`, data);
};
