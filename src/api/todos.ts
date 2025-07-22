import { Todo } from '../types/Todo';
import { TodoAgregate } from '../types/TodoAgregate';
import { client } from '../utils/fetchClient';

export const USER_ID = 3052;
export const TEMP_ID = 0;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: TodoAgregate): Promise<Todo> => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: Todo['id'],
  updating: Partial<Todo>,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, updating);
};
