import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export const addTodo = (userId: number, todo: Todo | null) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const removeTodos = (ids: number[]) => {
  const deleteRequests = ids.map(todoId => client.delete(`/todos/${todoId}`));

  return Promise.all(deleteRequests);
};

export const updateTodos = (
  ids: number[],
  updates: Partial<Todo>,
) => {
  const updateRequests = ids.map(id => client.patch<Todo>(`/todos/${id}`, updates));

  return Promise.all(updateRequests);
};
