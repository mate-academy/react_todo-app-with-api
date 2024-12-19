import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1584;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ completed, userId, title }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { completed, userId, title });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (id: number, todo: Partial<Todo>): Promise<Todo> => {
  return client.patch(`/todos/${id}`, todo);
};
