import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3460;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title: title.trim(),
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleTodoStatus = (
  todoId: number,
  currentTodoStatus: boolean,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, {
    completed: !currentTodoStatus,
  });
};

export const updateTodo = (id: number, title: string) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
