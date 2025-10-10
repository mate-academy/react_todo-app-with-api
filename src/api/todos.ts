import { InitialTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3443;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (initialTodo: InitialTodo) => {
  return client.post<Todo>('/todos', initialTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (
  todoId: number,
  todoStatus: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { completed: todoStatus });
};

export const updateTodo = (todoId: number, todoChanges: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, todoChanges);
};
