import { Todo, SendTodo, TodoStatus } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => client.get<Todo[]>(`/todos?userId=${userId}`);

export const createTodo = (
  userId: number,
  data: SendTodo,
) => client.post<Todo>(`/todos?userId=${userId}`, data);

export const deleteTodo = (todoId: number) => client.delete(`/todos/${todoId}`);

export const updateTodo = (
  todoId: number,
  data: Todo,
) => client.patch(`/todos/${todoId}`, data);

export const patchTodoStatus = (todoId: number, updatedStatus: TodoStatus) => client.patch(`/todos/${todoId}`, updatedStatus);
