import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { NewTodo } from '../types/NewTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ userId, title, completed }: NewTodo) => {
  return client.post<Todo>('/todos', {
    userId, title, completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: {}) => {
  return client.patch(`/todos/${todoId}`, data);
};
