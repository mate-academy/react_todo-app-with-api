import { client } from '../utils/fetchClient';
import { Todo } from '../types/Todo';

export const USER_ID = 1767;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post(`/todos`, { ...todo, userId: USER_ID });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodoParams = (
  todoId: Todo['id'],
  newData: Partial<Todo>,
) => {
  return client.patch(`/todos/${todoId}`, newData);
};
