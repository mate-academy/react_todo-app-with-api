import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoPost } from '../types/TodoPost';
import { TodoUpdate } from '../types/TodoUpdate';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodos = (
  userId: number,
  newTodo: TodoPost,
): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoOnServer = (
  todoId: number,
  updatedTodo: TodoUpdate,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};
