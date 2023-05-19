import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoData } from '../types/TodoData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (todoData: TodoData): Promise<Todo> => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodosCompleted = (todoId: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const changeTodosTitle = (todoId: number, title: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};
