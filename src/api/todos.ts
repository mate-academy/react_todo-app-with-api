import { Todo } from '../types/Todo';
import { RequireAtLeastOne } from '../types/utils/RequireAtLeastOne';
import { client } from '../utils/fetchClient';

export const USER_ID = 4142;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

type UpdatableTodo = Pick<Todo, 'title' | 'completed'>;

export const updateTodo = (
  id: number,
  body: RequireAtLeastOne<UpdatableTodo>,
) => {
  return client.patch<Todo>(`/todos/${id}`, body);
};
