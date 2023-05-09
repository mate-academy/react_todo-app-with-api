import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const removeTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodoCompleted = (
  todoId: number,
  completed: boolean,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { completed });
};

export const addTodo = (todo: Todo): Promise<Todo> => {
  return client.post('/todos', todo);
};

export const updateTodoTitle = (
  todoId: number,
  title: string,
): Promise<Todo> => {
  return client.patch(`/todos/${todoId}`, { title });
};
