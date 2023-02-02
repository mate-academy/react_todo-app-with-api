import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const creatTodo = (data: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', data);
};

export const deletingTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updatingTodoOnServer
  = (filedsToUpdate: Partial<Pick<Todo, 'completed' | 'title'>>,
    id: number) => {
    return client.patch<Todo>(`/todos/${id}`, filedsToUpdate);
  };
