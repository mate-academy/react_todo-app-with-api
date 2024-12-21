import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const USER_ID = 1799;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function createTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>(`/todos`, { title, userId, completed });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodo(data: Todo): Promise<Todo> {
  const { id } = data;

  return client.patch(`/todos/${id}`, data);
}
