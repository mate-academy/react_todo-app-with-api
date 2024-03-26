import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 287;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodos = (data: Todo) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodos = (_userId: number, todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = ({ completed, title, id }: Omit<Todo, 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed, title });
};
