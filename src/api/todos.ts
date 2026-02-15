import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3969;

type NewTodo = Omit<Todo, 'id'>;
type UpdateTodo = Partial<Pick<Todo, 'title' | 'completed'>>;

export const getTodos = (): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: NewTodo): Promise<Todo> => {
  return client.post<Todo, NewTodo>('/todos', todo);
};

export const deleteTodo = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: UpdateTodo): Promise<Todo> => {
  return client.patch<Todo, UpdateTodo>(`/todos/${todoId}`, data);
};
