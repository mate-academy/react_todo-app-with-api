import { NewTodo } from '../types/newTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: NewTodo) => {
  return client.post<NewTodo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoTitle = (
  userId: number,
  todoId: number,
  todoNewTitle: string,
) => {
  return client.patch<NewTodo>(`/todos/${todoId}?userId=${userId}`, { title: todoNewTitle });
};

export const updateTodoStatus = (
  userId: number,
  todoId: number,
  todoNewStatus: boolean,
) => {
  return client.patch<NewTodo>(`/todos/${todoId}?userId=${userId}`, { completed: todoNewStatus });
};
