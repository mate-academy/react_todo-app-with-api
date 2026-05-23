import { Todo, UpdateTodoDto } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../constants';

const load = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

const create = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    completed: false,
    title,
  });
};

const update = (id: Todo['id'], data: UpdateTodoDto) => {
  return client.patch<Todo>(`/todos/${id}`, data);
};

const remove = (id: Todo['id']) => {
  return client.delete(`/todos/${id}`);
};

export const todoApi = {
  load,
  create,
  update,
  remove,
};
