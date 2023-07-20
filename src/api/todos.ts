import { Todo } from '../types/Todo';
import { UpdateTodoArgs } from '../types/UpdateTodoArgs';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos?userId=${todo.userId}`, todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: UpdateTodoArgs,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
