import { Todo, TodoData } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 6316;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const addTodo = (newTodo: TodoData) => {
  return client.post<Todo>(`/todos?userId=${USER_ID}`, newTodo);
};

export const deleteTodo = (todoId: number) => {
  return client.delete(`/todos/${todoId}`);
};

export const updateTodo = (todo: Todo) => {
  return client.patch<Todo>(`/todos/${todo.id}`, todo);
};
