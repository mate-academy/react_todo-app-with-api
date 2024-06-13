import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 773;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (postId: number) => {
  return client.delete(`/todos/${postId}`);
};

export const addTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>(`/todos`, { title, userId, completed });
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos${todo.id}`, { todo });
};

// Add more methods here
