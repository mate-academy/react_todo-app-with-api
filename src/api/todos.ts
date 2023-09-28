import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoUpdateData } from '../types/TodoUpdateData';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number,
  data: TodoUpdateData,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
