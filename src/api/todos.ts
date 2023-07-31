import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodosFromServer = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodoToServer = (newTodo: Omit<Todo, 'id'>) => {
  const { title, userId, completed } = newTodo;

  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodoFromServer = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoOnServer = (updatedTodo: Omit<Todo, 'userId'>) => {
  const { id, title, completed } = updatedTodo;

  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};
