import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 587;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const delTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodos = (todoData: Todo) => {
  return client.post<Todo>(`/todos`, todoData);
};
