import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3107;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const createTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: title.trim() });
};

export const updateTodoStatus = (id: number, status: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: status });
};
