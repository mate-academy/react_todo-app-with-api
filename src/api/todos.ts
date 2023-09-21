import { Todo } from '../types/Todo';
import { UpdateCompleted } from '../types/UpdateCompleted';
import { UpdateTitle } from '../types/UpdateTitle';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, newTodo: Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number,
  data: UpdateCompleted | UpdateTitle) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};
