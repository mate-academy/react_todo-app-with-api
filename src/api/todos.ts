import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number,
  data: Pick<Todo, 'completed'> | Pick<Todo, 'title'>) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
