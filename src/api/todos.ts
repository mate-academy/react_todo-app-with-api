import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2966;

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

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, {
    completed,
  });
};

export const renameTodo = (id: number, newTitle: string) => {
  return client.patch(`/todos/${id}`, {
    title: newTitle,
  });
};
