import { Todo } from '../types/Todo';
import { TodoToAdd } from '../types/TodoToAdd';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: TodoToAdd) => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todoId: number, changedField: object) => {
  return client.patch(`/todos/${todoId}`, changedField);
};
