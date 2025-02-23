import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 334;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const sendTodoToServer = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodoFromServer = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleStatusTodo = (id: number, status: boolean) => {
  return client.patch(`/todos/${id}`, { completed: status });
};

export const renameTodoOnServer = (id: number, newTitle: string) => {
  return client.patch(`/todos/${id}`, { title: newTitle });
};
