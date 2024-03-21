import { USER_ID } from '../constants/credentials';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Update = {
  title?: string;
  completed?: boolean;
};

export const getTodosApi = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodoApi = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const updateTodoApi = (todoId: number, data: Update) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodoApi = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
