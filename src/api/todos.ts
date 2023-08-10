import { TodoUpdate, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

interface User {
  id: number,
  email:string,
}

export const getUserId = (email: string) => {
  return client.get<User[]>(`/users?email=${email}`);
};

export const postTodo = (title: string, userId: number) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const patchTodo = (
  id: number,
  keyToUpdate: TodoUpdate,
): Promise<Todo> => {
  return client.patch(`/todos/${id}`, keyToUpdate);
};
