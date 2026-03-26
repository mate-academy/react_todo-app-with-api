import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4072;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postCreateTodo = ({
  title,
  completed,
  userId,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const completedTodo = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const editTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
// Add more methods here
