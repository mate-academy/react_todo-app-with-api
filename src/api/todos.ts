import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2148;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const patchTodos = (
  Id: number | null,
  updateProperty: { title: string } | { completed: boolean },
) => {
  return client.patch<Todo>(`/todos/${Id}`, updateProperty);
};

export const postTodos = (newTodo: Todo) => {
  return client.post<Todo>(`/todos`, newTodo);
};

export const deleteTodos = (id: number) => {
  return client.delete(`/todos/${id}`);
};
