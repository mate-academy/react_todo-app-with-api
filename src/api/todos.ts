import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = (data: TodoData) => {
  return client.post('/todos', data);
};

export const deleteTodo = (id: number) => {
  return client.delete(`/todos/${id}`);
};

export const changeTodoStatus = (id: number, completed: boolean) => {
  return client.patch(`/todos/${id}`, completed);
};

export const changeTodoTitle = (id: number, title: string) => {
  return client.patch(`/todos/${id}`, title);
};
