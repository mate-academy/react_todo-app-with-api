import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { PatchTodoFragment, TodoFragment } from '../types/TodoFragment';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const postTodo = (todo: TodoFragment) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, todo: PatchTodoFragment) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
