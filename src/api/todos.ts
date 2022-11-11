import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

interface NewTodoData {
  title: string;
  userId: number;
  completed: boolean;
}

// Add more methods here
export const addTodo = (data: NewTodoData) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodo = (todoId: number, data: {}) => {
  return client.patch(`/todos/${todoId}`, data);
};
