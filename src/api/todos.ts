import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClients';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const API_URL = 'https://mate.academy/students-api/todos?userId=11577';
export const USER_ID = 11577;

export const addTodo = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
