import { Todo } from '../types/Todo';

const BASE_URL = 'https://mate.academy/students-api';

export const USER_ID = 11349;

export const getTodos = (): Promise<Todo[]> => {
  return fetch(`${BASE_URL}/todos?userId=${USER_ID}`).then(response => {
    if (!response.ok) {
      throw new Error('Unable to fetch todos');
    }

    return response.json();
  });
};

export const postTodo = (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  return fetch(`${BASE_URL}/todos`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Unable to add todo');
    }

    return response.json();
  });
};

export const deleteTodo = (id: number): Promise<void> => {
  return fetch(`${BASE_URL}/todos/${id}`, {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error('Unable to delete todo');
    }
  });
};

export const updateTodo = (todo: Todo): Promise<Todo> => {
  return fetch(`${BASE_URL}/todos/${todo.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(todo),
  }).then(response => {
    if (!response.ok) {
      throw new Error('Unable to update todo');
    }

    return response.json();
  });
};
