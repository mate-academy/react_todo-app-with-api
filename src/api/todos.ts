import { Todo } from '../types/TodoItem';
import { client } from '../utils/fetchClient';

export const handleGetTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const handleAddTodo = (userId: number, todo:Todo) => {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
};

export const handleDeleteTodos = (todosIds: number[]) => {
  const deleteRequests = todosIds.map(todoId => client.delete(`/todos/${todoId}`));

  return Promise.all(deleteRequests);
};

export const handleUpdateTodos = (todosIds: number[], value:Partial<Todo>) => {
  const updateRequests = todosIds.map(todoId => client.patch<Todo>(`/todos/${todoId}`, value));

  return Promise.all(updateRequests);
};
