import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1590;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Partial<Todo>) =>
  client.post<Todo>('/todos', todo);

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);
