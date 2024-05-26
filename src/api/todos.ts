import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 599;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const modifyTodo = (todoId: number, payload: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, payload);
};
