import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (
  userId: number,
  todo: Pick<Todo, 'completed' | 'title' | 'userId'>,
) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const editTodo = (
  todoId: number,
  todo: Partial<Todo>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
