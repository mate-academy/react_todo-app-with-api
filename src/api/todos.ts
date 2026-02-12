import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3923;

export const getTodos = async (): Promise<Todo[]> => {
  const response = await client.get<Todo[]>(`/todos?userId=${USER_ID}`);

  return response;
};

export const createTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    completed: false,
    userId: USER_ID,
  });
};

export const deleteTodo = <T>(todoId: number) => {
  return client.delete<T>(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  const { id, ...todoData } = todo;

  return client.patch<Todo>(`/todos/${id}`, todoData);
};
