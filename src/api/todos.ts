import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3092; //1782

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const updateTodo = ({ id, title, completed }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};
