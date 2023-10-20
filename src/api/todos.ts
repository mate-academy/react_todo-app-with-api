import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

type Data = Partial<Todo>;

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, data: Data): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
