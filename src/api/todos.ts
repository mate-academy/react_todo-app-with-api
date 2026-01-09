import { Todo, TodoUpdateData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3560;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({ userId, title, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { userId, title, completed });
};

export const updateTodo = ({
  id,
  ...todoData
}: TodoUpdateData): Promise<Todo> => {
  return client.patch(`/todos/${id}`, todoData);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};
