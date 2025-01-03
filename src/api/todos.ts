import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2147;
const BASE_LINK = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(BASE_LINK + `?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(BASE_LINK + `/${id}`);
};

export const addTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>(BASE_LINK, data);
};

export const editTodo = (todo: Todo) => {
  return client.patch<Todo>(BASE_LINK + `/${todo.id}`, todo);
};
