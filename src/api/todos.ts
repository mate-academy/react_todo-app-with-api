import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3030;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todo.id}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(todo),
    },
  );

  if (!response.ok) {
    throw new Error('Unable to update todo');
  }

  return response.json();
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
