import { TodoType } from '../types/TodoType';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<TodoType[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId: number, todo: Omit<TodoType, 'id'>) => {
  return client.post<TodoType>(`/todos?userId=${userId}`, { ...todo });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoStatus = (
  id: number,
  todo: Omit<TodoType, 'id'>,
) => {
  const changedStatus = !todo.completed;

  return client.patch<TodoType>(`/todos/${id}`, { ...todo, completed: changedStatus });
};

export const updateTodoTitle = (
  id: number,
  todo: Omit<TodoType, 'id'>,
) => {
  return client.patch<TodoType>(`/todos/${id}`, { ...todo });
};
