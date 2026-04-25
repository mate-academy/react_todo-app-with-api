import type { Todo, TodoUpdate } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json; charset=UTF-8',
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error();
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const getTodos = (userId: number) =>
  request<Todo[]>(`/todos?userId=${userId}`);

export const createTodo = (todo: Omit<Todo, 'id'>) =>
  request<Todo>('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  });

export const updateTodo = (todoId: number, changes: TodoUpdate) =>
  request<Todo>(`/todos/${todoId}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  });

export const deleteTodo = (todoId: number) =>
  request<void>(`/todos/${todoId}`, {
    method: 'DELETE',
  });
