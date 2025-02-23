import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 0;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const createTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos/`, newTodo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};
