import { CreateTodoFragment, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: CreateTodoFragment) => {
  return client.post<Todo>('/todos', newTodo);
};

export const updateTodo = (
  id: number,
  completed: boolean | null,
  title: string | null,
) => {
  return client.patch<Todo>(`/todos/${id}`, { title, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
