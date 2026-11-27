import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3638;

export type TodoChanges = Partial<Pick<Todo, 'title' | 'completed'>>;

export const getTodos = () => client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const createTodo = (title: string) =>
  client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });

export const updateTodo = (id: number, changes: TodoChanges) =>
  client.patch<Todo>(`/todos/${id}`, changes);

export const deleteTodo = (id: number) => client.delete(`/todos/${id}`);
