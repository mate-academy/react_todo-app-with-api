import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1252;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodo = (
  { completed }: Omit<Todo, 'id' | 'userId' | 'title'>,
  todoId: number,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const editTodoTitle = (
  { title }: Omit<Todo, 'userId' | 'completed' | 'id'>,
  todoId: number,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title });
};
