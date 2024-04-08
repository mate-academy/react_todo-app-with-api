import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 372;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = (todoId: number, updatedFields: object) => {
  return client.patch(`/todos/${todoId}`, updatedFields);
};
