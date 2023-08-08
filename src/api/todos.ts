import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = (todoId: number, status: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: status });
};

export const updateTodoTitle = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};
