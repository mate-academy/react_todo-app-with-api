import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4524;

type UpdateTodoData = {
  completed?: boolean;
  title?: string;
};

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: number, data: UpdateTodoData) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

// Add more methods here
