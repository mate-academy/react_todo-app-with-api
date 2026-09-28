import { Todo } from '../types/Todo';

// Keep whatever BASE_URL your existing file uses — the Mate Academy
// students API is typically this one:
const BASE_URL = 'https://mate.academy/students-api';

export const USER_ID = 123; // keep the value from your existing file

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${BASE_URL}/todos?userId=${USER_ID}`);

  if (!response.ok) {
    throw new Error('Failed to load todos');
  }

  return response.json();
};

export const addTodo = async (title: string): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: USER_ID,
      title,
      completed: false,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to add todo');
  }

  return response.json();
};

export const deleteTodo = async (todoId: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

export const updateTodo = async (
  todoId: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  return response.json();
};
