import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

// Add more methods here
export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const createTodo = (todoData: Todo) => {
  return client.post<Todo>('/todos', todoData);
};

export const editTodo = (todoData: Todo, todoId: number) => {
  return client.patch<Todo>(`/todos/${todoId}`, todoData);
};
