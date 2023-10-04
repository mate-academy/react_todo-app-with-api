import { Todo } from '../types/Todo';
import { USER_ID } from '../utils/Constants';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (todoTitle: string) => {
  return client.post<Todo>('/todos', {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodo = (
  {
    id,
    userId,
    title,
    completed,
  }: Todo,
): Promise<Todo> => {
  return client.patch<Todo>(`/todos/${id}`, {
    userId,
    title,
    completed,
  });
};
