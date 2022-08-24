import { NewTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: NewTodo) => {
  return client.post<NewTodo>('/todos', todo);
};

export const removeTodoByTodoId = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoByTodoId = (todoId: number, data: {}) => {
  return client.patch(`/todos/${todoId}`, data);
};
