import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 321;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const completeTodo = ({
  id,
  completed,
}: {
  id: number;
  completed: boolean;
}) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
  });
};

export const updateTodo = ({ id, title }: { id: number; title: string }) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
