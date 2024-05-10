import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 546;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (newTodo: any) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, updatedTodo: any) => {
  return client.patch(`/todos/${todoId}`, updatedTodo);
};
