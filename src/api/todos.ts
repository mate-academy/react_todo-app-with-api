import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 3036;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const patchTodoStatus = ({
  id: todoId,
  completed,
}: Todo): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { completed });
};

export const patchTodoTitle = ({ id: todoId, title }: Todo): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { title });
};

// Add more methods here
