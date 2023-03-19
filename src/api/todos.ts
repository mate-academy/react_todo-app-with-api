import {
  Todo,
  TodoRequest,
  TodoStatus,
  TodoTitle,
} from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: TodoRequest) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodoStatus = (todoId: number, updatedStatus: TodoStatus) => {
  return client.patch(`/todos/${todoId}`, updatedStatus);
};

export const patchTodoTitle = (todoId: number, updatedTitle: TodoTitle) => {
  return client.patch(`/todos/${todoId}`, updatedTitle);
};
