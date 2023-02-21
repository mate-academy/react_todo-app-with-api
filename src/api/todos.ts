import { RequestTodo } from '../types/RequestTodo';
import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const callGetTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const callAddTodo = (todo: RequestTodo) => {
  return client.post<Todo>('/todos', todo);
};

export const callDeleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const callEditTodo = (todo: Todo) => {
  return client.patch(`/todos/${todo.id}`, todo);
};
