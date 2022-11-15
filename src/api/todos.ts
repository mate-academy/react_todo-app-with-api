import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addNewTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoStatus = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    completed,
  });
};

export const updateTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    title,
  });
};
