import { Todo } from '../types/Todo';

export async function updateTodoStatus(
  id: number,
  completed: boolean,
): Promise<Todo> {
  const res = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });

  if (!res.ok) {
    throw new Error('Failed to update todo');
  }

  return res.json();
}
