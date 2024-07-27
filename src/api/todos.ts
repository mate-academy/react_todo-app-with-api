import { TodoType } from '../Types/TodoType';
import { client } from '../Utils/Client';

export const USER_ID = 10215;

export const getTodos = () => {
  return client.get<TodoType[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (id: number, data: Partial<TodoType>) => {
  return client.patch<TodoType>(`/todos/${id}`, data);
};
