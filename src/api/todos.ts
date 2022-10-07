import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addNewTodo = (todo: Todo) => {
  return client.post<Todo[]>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const checkboxTodo = (todoId: number, completed: boolean) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, { completed });
};

export const changeTitles = (todoId: number, title: string) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, { title });
};
