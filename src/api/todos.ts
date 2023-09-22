import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11124;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function addTodo(
  { title, completed, userId }: Omit<Todo, 'id'>,
) {
  return client.post<Todo>('/todos', { title, completed, userId });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodo({ id, ...todoData }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, todoData);
}
