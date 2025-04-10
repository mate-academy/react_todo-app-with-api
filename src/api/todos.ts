import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2504;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Partial<Todo>) => {
  return client.post<Todo>(`/todos`, newTodo);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const updateTodo = (
  todoId: number,
  data: Partial<Pick<Todo, 'title' | 'completed'>>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
