import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3309;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (data: Todo) => {
  return client.post<Todo>(`/todos`, data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const editTodo = ({
  id,
  userId,
  title,
  completed,
}: Todo): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed, userId });
};
