import { ChangeField, NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const changeTodo = (
  userId: number,
  todoId: number,
  todoField: ChangeField,
) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${userId}`, todoField);
};
