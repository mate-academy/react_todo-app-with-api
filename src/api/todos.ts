import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, title: string) => {
  const newTodo = {
    userId,
    title,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleStatus = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed: !completed });
};

export const renameTodo = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, { title });
};
