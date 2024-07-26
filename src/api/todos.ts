import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 1091;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = (title: string) => {
  return client.post<Todo>(`/todos`, {
    userId: USER_ID,
    title: title,
    completed: false,
  });
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const editTodo = ({ id, completed, title, isEdited, loaded }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    completed,
    title,
    isEdited,
    loaded,
  });
};

export const editTodoCheck = (id: number, completed: boolean) => {
  return client.patch<Todo>(`/todos/${id}`, { completed: completed });
};
