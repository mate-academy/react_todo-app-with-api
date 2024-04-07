import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 340;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodoStatus = (id: number, status: boolean) => {
  return client.patch(`/todos/${id}`, { completed: status });
};

export const renameTodo = (id: number, newTitle: string) => {
  return client.patch(`/todos/${id}`, { title: newTitle });
};
