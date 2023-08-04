import { Todo, TodoForServer } from '../types/todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: TodoForServer,
) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const updateComplete = (
  todoId: number,
  data: { completed: boolean },
) => {
  return client.patch(`/todos/${todoId}`, data);
};
