import { Todo } from '../types/Todo';
import { UpdatePostArg } from '../types/UpdatePostArg';
import { client } from '../utils/fetchClient';

export const USER_ID = 3936;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (post: Todo) => {
  return client.post<Todo>('/todos', post);
};

export const updatePost = (
  upgradePost: UpdatePostArg,
  id: number,
): Promise<Todo> => {
  return client.patch(`/todos/${id}`, upgradePost);
};

export const deletePost = (id: number) => {
  return client.delete(`/todos/${id}`);
};
