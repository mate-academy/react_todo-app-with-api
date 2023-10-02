import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { USER_ID } from '../constants/userId';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = ({ title, userId, completed }: Todo) => {
  return client.post<Todo>('/todos', {
    title,
    userId,
    completed,
  });
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
