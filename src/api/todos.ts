import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 29;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
