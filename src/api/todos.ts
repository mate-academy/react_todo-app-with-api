import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getTempTodo = (id: number) => {
  return client.get<Todo>(`/todos/${id}`);
};

export const addTodo = ({
  title,
  userId,
  completed,
} :Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
};

export const updateTodo = ({ id, completed, title } :Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    completed,
    title,
  });
};

export const deleteTodo = (id : number) => {
  return client.delete(`/todos/${id}`);
};
