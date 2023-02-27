import { Todo } from '../types/Todo';
import { TodoToAdd } from '../types/TodoToAdd';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = async (userId: number, todo: TodoToAdd) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const removeTodo = async (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const updateTodo = async (
  userId: number,
  todoId: number,
  data: object,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, data);
};
