import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2375;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: { title: string; completed: boolean }) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title: newTodo.title,
    completed: newTodo.completed,
  });
};

export const patchTodo = (id: number, updatedFields: Partial<Todo>) => {
  return client.patch<Todo>(`/todos/${id}`, updatedFields);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
