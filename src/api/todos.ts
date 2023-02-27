import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const updateTodoStatus = (
  userId: number,
  todoId: number,
  status: boolean,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { completed: status });
};

export const updateTodoTitle = (
  userId: number,
  todoId: number,
  newTitle: string,
) => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { title: newTitle });
};
