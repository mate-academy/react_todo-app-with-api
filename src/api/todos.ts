import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: string, data: Todo) => {
  return client.patch(`/todos/${todoId}`, data);
};
