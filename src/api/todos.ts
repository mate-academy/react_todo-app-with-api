import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 349;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodos = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};

// Add more methods here
