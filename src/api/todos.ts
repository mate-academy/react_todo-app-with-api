import { Todo } from '../types/Todo';
import { client, client2 } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
type NewTodoData = {
  title?: string,
  userId?: number,
  completed: boolean,
};

type FullTodoData = {
  id: number,
  userId: number,
  completed: boolean,
  title: string,
  createdAt: string,
  updatedAt: string,
};

type UpdatedData = {
  completed: boolean,
};

export const postTodo
= (userId: number, data: NewTodoData): Promise<FullTodoData> => {
  return client.post(`/todos?userId=${userId}`, data);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const updateTodo = (
  userId: number, todoId: number, updatedData: UpdatedData,
) => {
  return client.patch(`/todos/${todoId}/?userId=${userId}`, updatedData);
};

// ------------------------------------------------------Own methods-----------------------
export const getTodos2 = () => {
  return client2.get2<Todo[]>('/todos');
};

export const postTodo2
= (data: NewTodoData): Promise<FullTodoData> => {
  return client2.post2('/todos', data);
};

export const deleteTodo2 = (todoId: number) => {
  return client2.delete2(`/todos/${todoId}`);
};

export const updateTodo2 = (
  todoId: number, updatedData: UpdatedData,
) => {
  return client2.patch2(`/todos/${todoId}`, updatedData);
};
