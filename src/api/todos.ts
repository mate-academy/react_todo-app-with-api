import { client } from '../utils/fetchClient';
import { Todo } from '../components/todo.component/todo.types';

export const USER_ID = 628;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = (
  title: string,
  userId: number,
  completed = false,
): Promise<Todo> => {
  const data = { title, userId, completed };

  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`) as Promise<number>;
};

export const updateTodo = (todoId: number, data: Partial<Todo>) => {
  return client.patch(`/todos/${todoId}`, data) as Promise<Todo>;
};
