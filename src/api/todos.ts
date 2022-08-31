import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

type TodoWithoutId = Omit<Todo, 'id'>;

export const createTodo = (data: TodoWithoutId) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodoById = (todoId: number, data: {}) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
