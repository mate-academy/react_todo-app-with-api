import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = (userId: number, todoTitle: string) => {
  return client.post(`/todos?userId=${userId}`, todoTitle);
};

// Add more methods here
