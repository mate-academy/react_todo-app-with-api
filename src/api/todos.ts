import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 635;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete<number>(`/todos/${todoId}`);
};
