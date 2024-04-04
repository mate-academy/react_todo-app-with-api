import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 374;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateStatusTodo = (id: number, status: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: !status });
};

export const updateTitleTodo = (id: number, newTitle: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: newTitle });
};
