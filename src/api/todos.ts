import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4188;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodo = (
  id: number,
  title: string,
  completed: boolean,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    completed,
  });
};
// Add more methods here
