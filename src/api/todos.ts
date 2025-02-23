import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1353;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed,
  });
};

export const updateTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
