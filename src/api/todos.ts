import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({
  id, userId, title, completed,
}: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, { userId, title, completed });
};

export const getUser = (email: string) => {
  return client.get<User[]>(`/users?email=${email}`);
};

export const createUser = ({
  name, username, email, phone,
}: Omit<User, 'id'>) => {
  return client.post<User>('/users', {
    name, username, email, phone,
  });
};
