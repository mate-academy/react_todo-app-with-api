import { Todo } from '../types';

const BASE_URL = 'https://mate.academy/students-api';

export const USER_ID = 11349;

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${BASE_URL}/todos?userId=${USER_ID}`);

  if (!response.ok) {
    throw new Error('Unable to fetch todos');
  }

  return response.json();
};

export const postTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error('Unable to add todo');
  }

  return response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const response = await fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Unable to delete todo');
  }
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    throw new Error('Unable to update todo');
  }

  return response.json();
};
