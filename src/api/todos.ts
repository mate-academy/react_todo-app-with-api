import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type UpdateTodoData =
  | { title: string; completed?: never }
  | { completed: boolean; title?: never };

export const USER_ID = 3044;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, {
    title,
    userId,
    completed,
  });
};

export const updateTodo = (todoId: number, data: UpdateTodoData) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
