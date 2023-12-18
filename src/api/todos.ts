import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function createTodo({ title, completed, userId }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { title, completed, userId });
}

export const updateTodo = (todoId: number, todo: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, todo);
};
