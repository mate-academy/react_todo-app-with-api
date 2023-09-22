import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userd=${userId}`);
};

export const postTodo = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${newTodo.userId}`, newTodo);
};

export const deleteTodo = (taskId: number) => {
  return client.delete(`/todos/${taskId}`);
};

export const editTodo = (taskId: number, editedTodo: Partial<Todo>) => {
  return client.patch(`/todos/${taskId}`, editedTodo);
};
