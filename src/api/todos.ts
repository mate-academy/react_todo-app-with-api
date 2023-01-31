import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: any) => {
  return client.post<Todo>('/todos', data);
};

export const removeTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};

export const changeTodo = (
  todoId: number,
  newData: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, newData);
};
