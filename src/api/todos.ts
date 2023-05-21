import { Todo } from '../types/Todo';
import { UpdateDataTodo } from '../types/UpdateDataTodo';
import { client } from '../utils/fetchClient';

export const USER_ID = 10338;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos',
    { title, userId: USER_ID, completed: false });
};

export const destroyTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (data: UpdateDataTodo, id: number) => {
  return client.patch(`/todos/${id}`, data);
};
