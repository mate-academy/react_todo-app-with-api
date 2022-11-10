import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, title: string) => {
  const data = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoStatus = (todoId: number, status: boolean) => {
  const data = {
    completed: !status,
  };

  return client.patch(`/todos/${todoId}`, data);
};

export const updateTodoTitle = (todoId: number, newTitle: string) => {
  const data = {
    title: newTitle,
  };

  return client.patch(`/todos/${todoId}`, data);
};

// Add more methods here
