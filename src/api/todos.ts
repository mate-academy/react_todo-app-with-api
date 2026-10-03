import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4515;

export type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const updateTodo = (todoId: number, changes: TodoChanges) => {
  return client.patch<Todo>(`/todos/${todoId}`, changes);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
