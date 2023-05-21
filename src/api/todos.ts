import { Todo, TodoToSend } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6623;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: TodoToSend) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoTitle = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const updateTodoStatus = (
  todoId: number,
  status: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { completed: status });
};
