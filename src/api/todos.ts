import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (todoData: TodoData): Promise<Todo> => {
  return client.post<Todo>('/todos', todoData);
};

export const removeTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (todoId: number, todoData: boolean | string) => {
  if (typeof todoData === 'boolean') {
    return client.patch<Todo>(`/todos/${todoId}`, { completed: todoData });
  }

  return client.patch<Todo>(`/todos/${todoId}`, { title: todoData });
};
