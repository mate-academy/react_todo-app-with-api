import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3919;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { userId, title, completed });
};

export const updateTodo = ({ id, ...postData }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, postData);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
