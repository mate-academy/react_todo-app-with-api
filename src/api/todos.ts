import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function createTodo(preparedTodo: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', preparedTodo);
}

export function updateTodo({
  id,
  title,
  userId,
  completed,
}: Todo): Promise<Todo> {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    userId,
    completed,
  });
}
