import { Todo, TodoBase } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2358;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: TodoBase) => {
  return client.post<Todo>(`/todos`, {
    ...newTodo,
  });
};

export const renameTodo = (id: number, newName: string) => {
  return client.patch(`/todos/${id}`, { title: newName });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const toggleTodo = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, { completed: completed });
};
