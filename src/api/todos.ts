import { client } from '../fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 3687;

// --- Отримати всі Todos користувача ---
export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// --- Додати новий Todo ---
export const createTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post<Todo>('/todos', todo);
};

// --- Оновити Todo (наприклад, completed або title) ---
export const updateTodo = (id: number, data: Partial<Todo>): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

// --- Видалити Todo ---
export const deleteTodo = (id: number): Promise<void> => {
  return client.delete(`/todos/${id}`) as Promise<void>;
};
