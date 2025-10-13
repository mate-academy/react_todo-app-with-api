/* eslint-disable @typescript-eslint/no-explicit-any */
import { Todo } from '../types/Todo';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const BASE_URL = 'https://mate.academy/students-api/todos';

export const getTodos = async (userId: number): Promise<Todo[]> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}?userId=${userId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  const todos = await response.json();

  return Array.isArray(todos) ? todos : [];
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  await delay(300);

  // For JSONPlaceholder, we need to send the data in the expected format
  const response = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: todo.title,
      completed: todo.completed,
      userId: todo.userId,
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  const createdTodo = await response.json();

  // JSONPlaceholder returns id as 201, but we need to ensure it's a number
  return {
    id: createdTodo.id || Date.now(),
    title: createdTodo.title,
    completed: createdTodo.completed,
    userId: createdTodo.userId,
  };
};

export const updateTodo = async (
  id: number,
  updates: Partial<Todo>,
): Promise<Todo> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  const updatedTodo = await response.json();

  return updatedTodo;
};

export const deleteTodo = async (id: number): Promise<void> => {
  await delay(300);
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};
