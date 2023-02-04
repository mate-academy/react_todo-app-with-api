import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (
  newTodo: Pick<Todo, 'userId' | 'title' | 'completed'>,
) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodo = (
  todoId: number,
  newData: Partial<Pick<Todo, 'title' | 'completed'>>,
) => {
  return client.patch<Todo>(`/todos/${todoId}`, newData);
};
