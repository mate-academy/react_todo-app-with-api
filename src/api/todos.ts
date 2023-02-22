import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodo = (
  title: string,
  userId: number,
) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  title: string,
  completed: boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    title,
    completed,
  });
};
