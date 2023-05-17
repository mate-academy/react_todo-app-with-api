import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todo: TodoData) => {
  return client.post<Todo>('/todos', todo);
};

export const updateTodoStatus = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};
