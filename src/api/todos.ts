import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3217;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (title: string) => {
  return client.post<Todo>('/todos', {
    userId: USER_ID,
    title: title,
    completed: false,
  });
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};

// Add more methods here
