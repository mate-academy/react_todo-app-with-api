import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 790;

export const getTodosFromAPI = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodosToAPI = ({
  userId,
  title,
  completed,
}: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodosFromAPI = (item: Todo) => {
  return client.delete(`/todos/${item.id}`);
};

export const updateTodosAPI = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};

export const updateTodoCheckAPI = ({ id, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};
