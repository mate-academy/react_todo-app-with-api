import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function createTodo({ userId, title, completed }: Omit<Todo, 'id'>) {
  return client.post<Todo>('/todos', { userId, title, completed });
}

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export function updateTodoStatus(todoId: number, completed: boolean) {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
}

export const updateTodoTitle = (
  todoId: number,
  title: string,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};
