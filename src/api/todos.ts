import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3773;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (title: string): Promise<Todo> => {
  return client.post(`/todos`, {
    title: title,
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodo = (
  todoId: number,
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, {
    ...data,
  });
};
