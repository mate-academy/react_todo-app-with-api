import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export function patchTodo({ id, ...todoData }: Todo) {
  return client.patch<Todo>(`/todos/${id}`, todoData);
}
