import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = async (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export type TodoData = Pick<Todo, 'title' | 'completed' | 'userId'>;

export const createTodo = async (todo: TodoData) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = async (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = async (
  todoId: number,
  dataToUpdate: Partial<Todo>,
) => {
  return client.patch(`/todos/${todoId}`, dataToUpdate);
};
