import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 576;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodo = ({ title, completed, userId }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, completed, userId });
};

export const deleteTodoItem = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodoStatus = ({
  id,
  completed,
}: Omit<Todo, 'title' | 'userId'>) => {
  return client.patch<Todo>(`/todos/${id}`, { completed });
};

export const updateTodoTitle = ({
  id,
  title,
}: Omit<Todo, 'userId' | 'completed'>) => {
  return client.patch<Todo>(`/todos/${id}`, { title });
};
