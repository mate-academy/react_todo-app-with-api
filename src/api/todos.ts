import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todoData: TodoData) => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, data: Partial<TodoData>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
