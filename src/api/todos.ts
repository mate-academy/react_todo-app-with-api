import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export function deleteTodo(postId: number) {
  return client.delete(`/todos/${postId}`);
}

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = (
  todoId: number,
  data: { completed?: boolean, title?: string },
) => {
  return client.patch(`/todos/${todoId}`, data);
};
