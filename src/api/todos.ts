import { NewTodo } from '../types/NewTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, data: NewTodo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (
  todoId: number,
  data: {
    completed?: boolean,
    title?: string,
  },
) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
