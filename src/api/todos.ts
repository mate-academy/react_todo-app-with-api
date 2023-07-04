import { Todo, UpdatingTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (userId: number, title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodos = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const UpdateTodo = (todoId: number, data: UpdatingTodo) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
