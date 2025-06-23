import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3119;

type AddType = {
  title: string;
  userId: number;
  completed: boolean;
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: AddType) => {
  return client.post<Todo>(`/todos`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateCheckTodo = (todoId: number, compl: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed: compl });
};

export const updateTitleTodo = (todoId: number, title: string) => {
  return client.patch(`/todos/${todoId}`, { title: title });
};

// Add more methods here
