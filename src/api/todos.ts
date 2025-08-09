import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';
import { TodoModify } from '../types/TodoModify';

export const USER_ID = 3102;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const deleteTodo = (todoId: Todo['id']) => {
  return client.delete(`/todos/${todoId}`);
};

export const addTodo = (newTodo: TodoModify) => {
  return client.post<Todo>('/todos', newTodo);
};

export const updateTodo = (todoId: number, todo: TodoModify) => {
  return client.patch<Todo>(`/todos/${todoId}`, todo);
};
