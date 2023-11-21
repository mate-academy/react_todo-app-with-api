import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getTodoById = (todoId: number) => {
  return client.get<Todo>(`/todos?${todoId}`);
};

export const getTodosByStatus = (userId: number, completed: boolean) => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=${completed}`);
};

export const postTodo = (userId: number, newTodo: Omit<Todo, 'id'>) => {
  return client.post(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = (todoId: number, status: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: status });
};

export const updateTodoTitle = (todoId: number, newTitle: string) => {
  return client.patch(`/todos/${todoId}`, { title: newTitle });
};
