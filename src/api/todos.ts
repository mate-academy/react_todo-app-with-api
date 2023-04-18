import { Todo } from '../types/Todo';
import { User } from '../types/User';
import { client } from '../utils/fetchClient';

type NewUserType = Omit<User, 'updatedAt' | 'createdAt' | 'id'>;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const addTodos = (userId: number, todo: Omit<Todo, 'id'>) => {
  return client.post<Todo[]>(`/todos?userId=${userId}`, todo);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = (
  todoId: number,
  todo: { title?: string, completed?: boolean },
) => {
  return client.patch<Todo[]>(`/todos/${todoId}`, todo);
};

export const findUser = (email: string) => {
  return client.get<User[]>(`/users?email=${email}`);
};

export const addUsers = (newUser: NewUserType) => {
  return client.post<User[]>('/users', newUser);
};
