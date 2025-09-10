import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../utils/preferences';
import { BASE_URL } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
}

export function addTodo(title: string) {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
}

export const updateTodo = async (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  const response = await fetch(`${BASE_URL}/todos/${todoId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Unable to update a todo');
  }

  return response.json();
};
