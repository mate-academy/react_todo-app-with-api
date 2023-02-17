import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoTitle = (
  userId: number,
  todoId: number,
  newTitle: string,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { title: newTitle });
};

export const updateTodoStatus = (
  userId: number,
  todoId: number,
  newStatus: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { completed: newStatus });
};
