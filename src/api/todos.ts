import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const sendTodo = (options: {
  title: string,
  userId: number,
  completed: boolean,
}) => {
  return client.post<Todo>('/todos', options);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (
  { id, ...rest }: Partial<Todo> & Pick<Todo, 'id'>,
) => {
  return client.patch(`/todos/${id}`, rest);
};
