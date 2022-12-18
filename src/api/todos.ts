import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getAllTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>('/todos?userId=5414');
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const editTodo = (id: number, todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
