import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4538;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = ({
  id,
  ...fieldsToUpdate
}: Pick<Todo, 'id'> & Partial<Omit<Todo, 'id'>>) => {
  return client.patch<Todo>(`/todos/${id}`, fieldsToUpdate);
};
