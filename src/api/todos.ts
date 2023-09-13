import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todoId: number, todo: NewTodo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
