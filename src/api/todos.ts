import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 4424;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, {
    userId: todo.userId,
    title: todo.title,
    completed: todo.completed,
  });
};
