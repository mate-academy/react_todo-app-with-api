import { Todo } from '../types/Todo';
import { TodoData } from '../types/TodoData';
import { TodoUpdate } from '../types/todoUpdate';
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

export const changeTodo = (todoId: number, data: TodoUpdate): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, data);
};
