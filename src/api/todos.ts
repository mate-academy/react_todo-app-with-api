import { Todo, TodoAdd, TodoEdit } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: TodoAdd) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (todoId: number, updatedTodo: TodoEdit) => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};
