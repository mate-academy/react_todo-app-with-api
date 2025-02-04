import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2313;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (todoTitle: string) => {
  return client.post<Todo>(`/todos`, {
    USER_ID,
    title: todoTitle,
    completed: false,
  });
};

export const deleteTodoById = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    title,
    completed,
  });
};
