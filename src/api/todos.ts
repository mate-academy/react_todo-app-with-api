import { Todo } from '../types/Todo';
import { TodoUpdate } from '../types/TodoUpdate';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (newTodo: unknown): Promise<Todo> => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoOnServer = (
  todoId: number,
  updatedTodo: TodoUpdate,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};
