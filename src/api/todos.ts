import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 11529;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    title,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({
  id, title, userId, completed,
}: Todo): Promise<Todo> => {
  return client.patch(`/todos/${id}`, {
    title,
    userId,
    completed,
  });
};
