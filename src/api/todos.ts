import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updatedTodo = (todo: Todo) => {
  const {
    id,
    title,
    completed,
    userId,
  } = todo;
  const trimmedTitle = title.trim();

  return client.patch<Todo>(`/todos/${id}`, { title: trimmedTitle, completed, userId });
};
