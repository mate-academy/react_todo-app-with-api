import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodoCompleted = (
  todoId: number, data: { completed: boolean },
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const updateTodoTitle = (
  todoId: number, data: { title: string },
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
