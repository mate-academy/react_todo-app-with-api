import { Todo, TodoData, TodoUpdateData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, data: TodoData) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: TodoUpdateData) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
