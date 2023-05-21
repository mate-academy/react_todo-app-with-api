import { NewTodoData, Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const getTodos = (userId: number) => {
  return client.get<Todo[]>(`/todos?userId=${userId}`);
};

export const createTodo = ((todo: NewTodoData) => {
  return client.post<Todo>('/todos', todo);
});

export const patchTodo = ((todoId: number, data: Todo) => {
  return client.patch<Todo>(`/todos/${todoId}`, data);
});

export const removeTodo = ((todoId: number) => {
  return client.delete(`/todos/${todoId}`);
});
