import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Partial<Todo>) => {
  return client.post<Todo>('/todos', todo);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const changeTodo = (todoProp: Partial<Todo>, todoId: number) => {
  return client.patch(`/todos/${todoId}`, todoProp);
};
