import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2257;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId,
    completed,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodos = ({ id, title, userId, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    title,
    userId,
    completed,
  });
};
// Add more methods here
//?userId=${USER_ID}
