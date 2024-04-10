import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 439;
export const TEMPORARY_TODO_ID = 1234567890;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = ({ id, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
