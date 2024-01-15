import { Todo } from '../types';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const postTodo = ({
  userId,
  title,
  completed,
}: Partial<Todo>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const setCompleted = ({ id, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodo = (
  todoId: number,
  { title, completed, userId }: Todo,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { title, completed, userId });
};

export const updateTodoTitle = (
  todoId: number, title: string,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};
