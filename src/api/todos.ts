import { Todo } from '../types/Types';
import { client } from '../utils/fetchClient';

export const USER_ID = 3207;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const makeCompleted = ({ id, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
  });
};

export const updateTodo = ({ id, title }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
  });
};
// Add more methods here
