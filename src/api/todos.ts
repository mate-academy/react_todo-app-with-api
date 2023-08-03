import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todoId: number, updateData: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${todoId}`, updateData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
