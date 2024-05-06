import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 519;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    completed: false,
    title,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Omit<Todo, 'id'>) => {
  return client.patch(`/todos/${todoId}`, data);
};
