import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type UpdateData = {
  completed?: boolean,
  title?: string,
  userId: number,
};

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const addTodo = (todo: Todo) => client.post<Todo>('/todos', todo);

export const updateTodo = (id:number, todo: UpdateData) => client.patch<Todo>(`/todos/${id}`, todo);
