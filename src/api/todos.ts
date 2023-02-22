import { Todo, TodoWithoutId } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here

export function addTodos(userId: number, todo: TodoWithoutId) {
  return client.post<Todo>(`/todos?userId=${userId}`, todo);
}

export const deleteTodo = (userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}?userId=${userId}`);
};

export const updateTodoStatus = (
  userId: number,
  todoId: number,
  newStatus: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { completed: newStatus });
};

export const updateTodoName = (
  userId: number,
  todoId: number,
  newName: string,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}?userId=${userId}`, { title: newName });
};
