import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { NewTodo } from '../types/NewTodo';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const completedTodo = (userId: number, todoId: number, todo: object) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, todo);
};

export const updateTodoTitle = (
  userId: number,
  todoId: number,
  todo: object,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, todo);
};
