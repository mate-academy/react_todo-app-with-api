import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (todo: Todo) => {
  return client.post<Todo>('/todos', todo);
};

export const deleteTodo = (id:number) => {
  return client.delete(`/todos/${id}`);
};

export const updateTodo = (id:number, todo:Omit <Todo, 'userId' | 'title'>) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};

export const updateTodoTitle = (id:number, todo:Todo) => {
  return client.patch<Todo>(`/todos/${id}`, todo);
};
