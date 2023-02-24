import { NewTodo } from '../types/newTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: NewTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoTitle = (
  userId: number,
  todoId: number,
  todoNewTitle: string,
) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${userId}`, { title: todoNewTitle });
};

export const updateTodoStatus = (
  userId: number,
  todoId: number,
  todoNewStatus: boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}?userId=${userId}`, { completed: todoNewStatus });
};
