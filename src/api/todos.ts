import { Todo, TodoId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3432;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodos = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (todoId: TodoId) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (
  todoId: TodoId,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
