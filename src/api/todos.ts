import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const getCompletedTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=true `);
};

export const postTodo = (todo: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, todo);
};

export const patchTodoCompleted = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: completed });
};

export const patchTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title: title });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

// Add more methods here
