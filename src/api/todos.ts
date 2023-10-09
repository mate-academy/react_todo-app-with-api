import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const API_URL = 'https://mate.academy/students-api/todos?userId=11577';
export const USER_ID = 11577;

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (id: number, todo: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
