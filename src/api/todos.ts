import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const patchTodoTitle = (todoId: number, data: Pick<Todo, 'title'>) => {
  return client.patch(`/todos/${todoId}`, data);
};

export const patchTodoStatus = (
  todoId: number,
  data: Pick<Todo, 'completed'>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
