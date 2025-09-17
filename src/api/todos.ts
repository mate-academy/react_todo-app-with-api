import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';
import { BASE_URL } from '../utils/fetchClients';

export const USER_ID = 3476;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export function deleteTodo(id: number) {
  return client.delete(`/todos/${id}`);
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
// Add more methods here
