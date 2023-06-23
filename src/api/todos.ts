import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TempTodo } from '../types/TempTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: TempTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoTitle = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, { title });
};

export const updateTodoStatus = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed });
};
