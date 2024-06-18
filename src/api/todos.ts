import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 424;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (title: string) => {
  return client.post(`/todos`, {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/` + id);
};

export const updateTodo = ({
  id,
  data,
}: {
  id: number;
  data: { completed: boolean } | { title: string };
}) => {
  return client.patch(`/todos/` + id, data);
};
