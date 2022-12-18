import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Partial<Todo>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoTitle = (todoId: number, title: string) => {
  return client.patch(`/todos/${todoId}`, { title });
};

export const updateTodoCompleted = (todoId: number, completed: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed });
};
