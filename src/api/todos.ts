import { Todo } from '../types/Types';
import { client } from '../utils/fetchClient';

export const USER_ID = 3461;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const postTodo = ({ title }: { title: string }) => {
  return client.post<Todo>(`/todos`, {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export function deleteTodo(postId: number) {
  return client.delete(`/todos/${postId}`);
}

export function updateTodo(
  id: number,
  data: { title?: string; completed?: boolean },
): Promise<Todo> {
  return client.patch<Todo>(`/todos/${id}`, data);
}
