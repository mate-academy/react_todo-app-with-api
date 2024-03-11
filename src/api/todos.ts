import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 230;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Add more methods here
export const addTodo = (todoTitle: string) => {
  return client.post<Todo>('/todos', {
    title: todoTitle,
    userId: USER_ID,
    completed: false,
  });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ id, userId, title, completed }: Todo) => {
  return client.patch<Todo>(`/todos/${id}`, {
    userId,
    title,
    completed,
  });
};
