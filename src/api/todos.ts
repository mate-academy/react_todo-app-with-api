import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 326;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export function deleteTodo(todoId: number) {
  return client.delete(`/todos/${todoId}`);
}

export const updateTodo = (todoId: number, todo: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
