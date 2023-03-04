import { Todo, NewTodo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todo: Todo) => {
  return client.delete(`/todos/${todo.id}?userId=${userId}`);
};

export const updateTitleTodo = (
  todoId: number,
  newTitle: string,
) => {
  return client.patch(`/todos/${todoId}`, { title: newTitle });
};

export const updateStatusTodo = (
  todoId: number,
  newStatus: boolean,
) => {
  return client.patch(`/todos/${todoId}`, { completed: newStatus });
};
