import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Partial<Todo>) => (
  client.post<Todo>('/todos', newTodo)
);

export const removeTodo = (todoId: number) => (
  client.delete(`/todos/${todoId}`)
);

export const chandeTodoStatus = (todoId: number, completed: boolean) => (
  client.patch(`/todos/${todoId}`, { completed })
);

export const chandeTodoText = (todoId: number, title: string) => (
  client.patch(`/todos/${todoId}`, { title })
);
