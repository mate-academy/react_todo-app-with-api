import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const postTodos = (title: string, userId: number) => {
  return client.post('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const updateTodo = (title: string, userId: number) => {
  return client.patch(`/todos/${userId}`, {
    title,
  });
};

export const deleteTodo = (userId: number) => {
  return client.delete(`/todos/${userId}`);
};
