import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3246;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, completed }: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { title, userId: USER_ID, completed });
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateTodos = ({ id, ...todoData }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, todoData);
};
