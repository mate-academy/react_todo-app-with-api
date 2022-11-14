import { Todo, TodoToPost } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: TodoToPost) => (
  client.post<Todo>('/todos', newTodo)
);

export const removeTodo = (todoId: number) => {
  client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, data: TodoToPost) => {
  return client.patch(`/todos/${todoId}`, data);
};
