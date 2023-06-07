import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (data: Omit<Todo, 'createdAt'
| 'updatedAt' | 'id' >) => {
  return client.post<Todo>('/todos', data);
};

export const deleteTodo = (id:number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTitle = (id:number, title:string) => {
  return client.patch(`/todos/${id}`, { title });
};

export const updateIsCompleted = (
  id:number, completed:boolean, userId:number,
) => {
  return client.patch(`/todos/${id}`, { completed, userId });
};
