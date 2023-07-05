import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const updateTodo = ({ id, ...data }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

// Add more methods here
