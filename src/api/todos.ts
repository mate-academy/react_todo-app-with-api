import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2102;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: string) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    title: title,
    userId: USER_ID,
    completed: false,
  });
};

export const updateTodoStatus = (todoId: string, prevState: boolean) => {
  return client.patch<Todo>(`/todos/${todoId}`, { completed: !prevState });
};

export const updateTodoTitle = (todoId: string, newTitle: string) => {
  return client.patch<Todo>(`/todos/${todoId}`, { title: newTitle });
};
