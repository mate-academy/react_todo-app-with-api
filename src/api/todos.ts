import { Todo } from '../types/Todo';
import { client } from '../utilis/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodos = (id: number, todo:Omit <Todo, 'id'>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
