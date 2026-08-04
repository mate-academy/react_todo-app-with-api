import type { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type StoredUser = {
  id?: number;
};

export type NewTodo = Omit<Todo, 'id'>;
export type TodoUpdate = Partial<Pick<Todo, 'title' | 'completed'>>;

function getStoredUserId(): number {
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
    return 0;
  }

  try {
    const user = JSON.parse(storedUser) as StoredUser;

    return Number(user.id) || 0;
  } catch {
    return 0;
  }
}

export const USER_ID = getStoredUserId();

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: NewTodo): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = (
  todoId: number,
  changes: TodoUpdate,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, changes);
};

export const deleteTodo = (todoId: number): Promise<unknown> => {
  return client.delete(`/todos/${todoId}`);
};
