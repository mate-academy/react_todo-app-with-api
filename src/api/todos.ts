import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, changeValue: boolean | string) => {
  if (typeof changeValue === 'string') {
    return client.patch<Todo>(`/todos/${todoId}`, { title: changeValue });
  }

  return client.patch<Todo>(`/todos/${todoId}`, { completed: changeValue });
};
