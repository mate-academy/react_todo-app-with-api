import { Todo, TodoUpdate } from '../types/Todo';
import { client } from '../utils/fetchedClients';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: TodoUpdate): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
