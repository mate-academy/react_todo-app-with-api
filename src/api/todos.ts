import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo, userId: number) => {
  return client.post(`/todos?userId=${userId}`, todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({
  id,
  title,
  userId,
  completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { title, userId, completed });
};
