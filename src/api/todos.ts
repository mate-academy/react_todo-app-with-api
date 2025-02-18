import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2321;

export const fetchTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({ id, title, completed }: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    completed,
    userId: USER_ID,
  });
};
