import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 187;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    completed: false,
    title,
    userId: USER_ID,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateCompletedTodo = (id: number, isCompleted: boolean) => {
  return client.patch(`/todos/${id}`, { completed: isCompleted });
};

export const updateTitleTodo = (id: number, newTitle: string) => {
  return client.patch(`/todos/${id}`, { title: newTitle });
};

// Add more methods here
