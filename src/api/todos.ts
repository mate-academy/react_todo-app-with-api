import { PartialTodo, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (userId:number, title: string) => {
  const newTodo = {
    title,
    userId,
    completed: false,
  };

  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  const url = `/todos/${todoId}`;

  return client.delete(url);
};

export const patchTodo = (todoId:number, data:PartialTodo) => {
  const url = `/todos/${todoId}`;

  return client.patch(url, data);
};
