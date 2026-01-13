import { Todo } from '../types/Todo';
//import { client } from '../utils/fetchClient';
import { client } from '../utils/fetchClients';

export const USER_ID = 3806;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string): Promise<Todo> => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
