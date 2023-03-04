import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number, filter?: boolean) => {
  return client.get<Todo[]>(`/todos?userId=${userId}${filter ? `&completed=${filter}` : ''}`);
};

export const postTodo = (data:NewTodo) => {
  return client.post<NewTodo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodo = (id: number, data: Todo) => {
  return client.patch(`/todos/${id}`, data);
};
