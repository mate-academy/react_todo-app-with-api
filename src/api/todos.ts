import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2584;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    id: 0,
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodoStatus = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed });
};

export const updateTodo = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, { title });
};

// Add more methods here
