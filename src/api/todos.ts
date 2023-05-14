import { Todo } from '../types/Todo';
import { TodoToUpdate } from '../types/TodoToUpdate';
import { client } from '../utils/fetchClient';
import { TodoPost } from '../types/TodoPost';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo
= (userId: number, newTodo: TodoPost): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoOnServer = (
  todoId: number,
  updatedTodo: TodoToUpdate,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, updatedTodo);
};
