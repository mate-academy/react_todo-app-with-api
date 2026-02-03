import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

const getStoredUserId = (): number => {
  if (typeof window === 'undefined') {
    return 0;
  }

  try {
    const stored = localStorage.getItem('user');
    const parsed = stored ? JSON.parse(stored) : null;
    const id = Number(parsed?.id);

    return Number.isFinite(id) && id > 0 ? id : 0;
  } catch {
    return 0;
  }
};

const envUserId = Number(import.meta.env.VITE_USER_ID);

export const USER_ID =
  Number.isFinite(envUserId) && envUserId > 0 ? envUserId : getStoredUserId();

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = ({
  completed,
  title,
  userId = USER_ID,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { completed, title, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

type UpdateTodoPayload = {
  todoId: number;
  title?: string;
  completed?: boolean;
  userId?: number;
};

export const updateTodo = ({
  todoId,
  title,
  completed,
  userId = USER_ID,
}: UpdateTodoPayload) => {
  const data: Partial<Todo> = { userId };

  if (title !== undefined) {
    data.title = title;
  }

  if (completed !== undefined) {
    data.completed = completed;
  }

  return client.patch<Todo>(`/todos/${todoId}`, data);
};
