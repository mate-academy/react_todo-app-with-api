import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (data: Todo) => {
  return client.post('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const completeTodo = (todoId: number, data: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: data });
};

export const renameTodo = (todoId: number, title: string) => {
  return client.patch(`/todos/${todoId}`, { title });
};
