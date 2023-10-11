import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getTodo = (todoId: number) => {
  return client.get<Todo[]>(`/todos/${todoId}`);
};

export const addTodo = (todo: Partial<Todo>) => {
  return client.post('/todos', todo);
};

export const deleteTodo = (todoId : number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todo: Todo, data: Partial<Todo>) => {
  return client.patch(`/todos/${todo.id}`, data);
};
