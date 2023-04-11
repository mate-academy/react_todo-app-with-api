import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodosFromServer = async (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoOnServer = async (userId: number, newTodo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodoOnServer = async (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const updateTodoOnServer = async (
  userId: number,
  updatedTodo: Required<Pick<Todo, 'id'>> & Partial<Todo>,
) => {
  return client.patch(`/todos/${updatedTodo.id}?userId=${userId}`, updatedTodo);
};
