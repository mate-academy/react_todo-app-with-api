import {
  Compete,
  Edit,
  NewTodo,
  Todo,
} from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: NewTodo): Promise<Todo> => {
  return client.post('/todos', newTodo);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeComplete = (id: number, data: Compete) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

export const changeTitle = (id: number, data: Edit) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};
