import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 410;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const creatTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const updateTodo = (todoId: number, completTodo: Todo) => {
  return client.patch(`/todos/${todoId}`, completTodo);
};
