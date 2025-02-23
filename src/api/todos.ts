import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../utils/CONSTANTS';
import { TodoOmited } from '../types/TodoOmited';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ id, ...body }: Todo) => {
  return client.post<Todo>('/todos', body);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodo = ({ id, ...body }: TodoOmited) => {
  return client.patch<Todo>(`/todos/${id}`, body);
};
