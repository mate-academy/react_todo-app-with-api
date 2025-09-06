import { USER_ID } from '../constant/const';
import { Todo } from '../types/todo';
import { client } from '../utils/fetchClient';

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const postTodos = (todo: Todo) => {
  return client.post<Todo, Todo>('/todos', todo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (
  todoId: Todo['id'],
  data: Partial<Todo>,
): Promise<Todo> => {
  return client.patch<Todo, Partial<Todo>>(`/todos/${todoId}`, data);
};
