import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: NewTodo): Promise<Todo> => {
  return client.post('/todos', todo);
};

export const removeTodoByTodoId = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoByTodoId = (todoId: number, data: {}): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
