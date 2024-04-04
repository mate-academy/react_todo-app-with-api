import { TempTodo } from '../types/TempTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export function getTodos(userId: number) {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
}

export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { userId, title, completed });
}

export function deleteTodos(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodo({ id, title, completed }: Todo | TempTodo) {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
}
