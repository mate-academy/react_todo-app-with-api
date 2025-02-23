import { Todo, TodoWithoutId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 640;

export const getTodos = (): Promise<Todo[]> =>
  client.get<Todo[]>(`/todos?userId=${USER_ID}`);

export const addTodo = (todo: TodoWithoutId): Promise<Todo> =>
  client.post<Todo>('/todos', todo);

export const deleteTodo = (todoId: number): Promise<unknown> =>
  client.delete(`/todos/${todoId}`);

export const updateTodo = (todo: Todo): Promise<Todo> =>
  client.patch<Todo>(`/todos/${todo.id}`, todo);
