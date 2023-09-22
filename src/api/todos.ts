import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const updateTodo = ({ id, ...todo }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
