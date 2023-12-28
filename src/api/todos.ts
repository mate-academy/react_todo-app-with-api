import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const postTodo = ({ title, userId, completed }: Omit<Todo, 'id'>) => {
  return client.post<Todo>('/todos', { title, userId, completed });
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const toggleCompleteTodo = (todoId: number, completed: boolean) => {
  return client.patch(`/todos/${todoId}`, { completed });
};

export const changeTodoTitle = (todoId: number, newTitle: string) => {
  return client.patch(`/todos/${todoId}`, { title: newTitle });
};
