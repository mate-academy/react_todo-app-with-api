import { Todo } from '../types/Todo';
import { USER_ID } from '../types/UserId';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Partial<Todo>): Promise<Todo> => {
  return client.patch(`/todos/${todo.id}`, todo);
};

// Add more methods here
