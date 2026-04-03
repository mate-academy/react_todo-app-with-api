import { Todo } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

function getUser(): { id: number } | null {
  try {
    const raw = localStorage.getItem('user');

    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function getUserId(): number {
  return getUser()?.id ?? 0;
}

type TodoData = Omit<Todo, 'id'>;

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, options);

  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }

  return response.json();
}

export function getTodos(userId: number): Promise<Todo[]> {
  return request<Todo[]>(`/todos?userId=${userId}`);
}

export function createTodo(data: TodoData): Promise<Todo> {
  return request<Todo>('/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}

export function deleteTodo(id: number): Promise<void> {
  return request<void>(`/todos/${id}`, { method: 'DELETE' });
}

export function updateTodo(
  id: number,
  data: Partial<Pick<Todo, 'completed' | 'title'>>,
): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
}
