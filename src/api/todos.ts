import { Todo } from '../types/Todo';
import { TodoToAdd } from '../types/TodoToAdd';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number): Promise<Todo[]> => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const addTodo = (newTodo: TodoToAdd): Promise<Todo> => {
  return client.post<Todo>('/todos', newTodo);
};

export const deleteTodo = (todoId: number): Promise<any> => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: number, changedField: object
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, changedField);
};
