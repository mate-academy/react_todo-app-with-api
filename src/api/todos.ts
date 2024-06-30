import { TodoType } from '../types/Todo.type';
import { client } from '../utils/FetchClient';

export const USER_ID = 752;

export const getTodos = () => {
  return client.get<TodoType[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodos = (title: string) => {
  const body = { userId: USER_ID, title: title, completed: false };

  return client.post<TodoType>('/todos', body);
};

export const updateTodos = (todo: TodoType) => {
  return client.patch<TodoType>(`/todos/${todo.id}`, todo);
};
