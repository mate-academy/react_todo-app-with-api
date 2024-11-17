import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../utils/USER_ID';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodos = (todoId: number): Promise<void> => {
  return client.delete(`/todos/${todoId}`).then(() => {});
};

export const addTodo = (newTodo: Omit<Todo, 'id'>): Promise<Todo> => {
  return client.post('/todos', newTodo);
};

export const changeTodo = (
  todoId: number,
  updatedFields?: Partial<Todo>,
): Promise<void> => {
  return client.patch(`/todos/${todoId}`, updatedFields);
};
