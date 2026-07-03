import { Todo, TodoUpdate } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4089;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: Todo['title']) => {
  return client.post<Todo>(`/todos`, {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id: Todo['id'], body: TodoUpdate) => {
  return client.patch<Todo>(`/todos/${id}`, body);
};
