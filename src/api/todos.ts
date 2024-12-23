import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 254;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, completed, userId });
};

export const getTodo = (id: number) => {
  return client.get<Todo>(`/todos?userId=${USER_ID}/todos?userId=${id}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateCompletedTodo = (id: number, newTodo: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, newTodo);
};

export const updateTitleTodo = (id: number, title: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, title);
};
// Add more methods here
