import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4504;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todoData: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todoData);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  id: number,
  todoData: Partial<Omit<Todo, 'id' | 'userId'>>,
) => {
  return client.patch<Todo>(`/todos/${id}`, todoData);
};
