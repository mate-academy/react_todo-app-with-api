import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (title: string, userId: number): Promise<Todo> => {
  return client.post('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const changeTodoStatus = (
  id: number,
  status: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${id}`, {
    completed: status,
  });
};

export const updateTodo = (title: string, id: number) => {
  return client.patch(`/todos/${id}`, {
    title,
  });
};

// Add more methods here
