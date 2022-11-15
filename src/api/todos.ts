import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`) || null;
};

export const createTodos = (todo: Todo) => {
  const { userId, title, completed } = todo;

  return client.post<Todo[]>('/todos', {
    userId,
    title,
    completed,
  });
};

export const removeTodo = (todo: Todo) => {
  return client.delete(`/todos/${todo.id}`);
};

export const updateTodo = (todo: Todo, completed: boolean) => {
  return client.patch(`/todos/${todo.id}`, { completed });
};

export const editTodo = (todo: Todo, title: string) => {
  return client.patch(`/todos/${todo.id}`, { title });
};
