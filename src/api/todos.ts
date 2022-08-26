import { addedTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: addedTodo) => {
  return client.post<Todo>('/todos', data);
};

export const changeTodo = (todoId: number, data:{}) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
