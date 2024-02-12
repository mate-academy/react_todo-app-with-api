import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteData = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

type UpdateTodoInput = Partial<Omit<Todo, 'userId'>>;

export const updateTodo = ({ id, completed, title }: UpdateTodoInput) => {
  return client.patch<Todo>(`/todos/${id}`, { completed, title });
};
