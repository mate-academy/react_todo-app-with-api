import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3332;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const deleteCompletedTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}&completed=true`);
};

export const createTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
