import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 467;

const BASE_TODOS_PATH = '/todos';

export const getTodos = () => {
  return client.get<Todo[]>(`${BASE_TODOS_PATH}?userId=${USER_ID}`);
};

export const deleteTodo = (id: Todo['id']) => {
  return client.delete(`${BASE_TODOS_PATH}/${id}`);
};

export const addTodo = (title: Todo['title']) => {
  return client.post(BASE_TODOS_PATH, {
    title: title,
    userId: USER_ID,
    completed: false,
  });
};

export const patchTodo = (
  id: Todo['id'],
  title: Todo['title'],
  completed: Todo['completed'],
) => {
  return client.patch(`${BASE_TODOS_PATH}/${id}`, {
    title: title,
    completed: completed,
  });
};
