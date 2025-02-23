import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1395;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, ...rest }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, rest);
};

// Add more methods here
