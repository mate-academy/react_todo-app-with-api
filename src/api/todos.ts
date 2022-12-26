import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: Todo) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const getCompletedTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}&completed=true`);
};

export const updateTodoStatus = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    completed,
  });
};

export const updateTodoTitle = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, {
    id,
    title,
  });
};
