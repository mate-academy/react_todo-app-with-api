import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodos = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodos = ({
  title,
  userId,
  completed,
}: {
  title: string,
  userId: number,
  completed: boolean,
}): Promise<Todo> => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodoStatus = (todoId: number,
  completed: boolean): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed });
};

export const updateTodoTitle = (TodoId: number,
  { title }: Pick<Todo, 'title'>) => {
  return client.patch<Todo>(`/todos/${TodoId}`, { title });
};
