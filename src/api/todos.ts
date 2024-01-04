import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11847;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ completed, title, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { completed, title, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  });
};
// Add more methods here
