import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodosFromServer = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoOnServer = (newTodo: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodoOnServer = (todoId: number, completed: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed });
};

export const changeTitleTodoOnServer = (todoId: number, title: string) => {
  return client.patch(`/todos/${todoId}`, { title });
};
